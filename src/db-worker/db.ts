import { DBSchema, openDB } from 'idb';
import { HistoryEntry, PaletteEntry } from '../entry';
import { revokeIfObjectUrl } from '../revoke-object-url';
import { blobToDataUri, processEntry } from './process-entry';
import { EXAMPLES } from './examples';

interface ColorBreakdownDBSchema extends DBSchema {
    history: {
        key: number;
        value: HistoryEntry;
    };
    example: {
        key: number;
        value: {
            readonly id: number;
            readonly hidden: true;
        };
    };
}

export const dbPromise = openDB<ColorBreakdownDBSchema>('history-store', 2, {
    upgrade(db, oldVersion) {
        switch (oldVersion) {
            case 0:
                db.createObjectStore('history', { keyPath: 'id' });
            // fall through
            case 1:
                db.createObjectStore('example', { keyPath: 'id' });
            // fall through
        }
    },
});

/**
 * Loads a single history item for the main palette viewer
 */
export async function loadItemFromDB(
    timestamp: number,
): Promise<PaletteEntry | undefined> {
    const db = await dbPromise;
    if (timestamp < 10) {
        const info = await db.get('example', timestamp);
        const hidden = info?.hidden || false;
        return hidden ? undefined : EXAMPLES.get(timestamp) || undefined;
    } else {
        const item = await db.get('history', timestamp);
        return processEntry(item);
    }
}

export async function openFirstItem(): Promise<PaletteEntry | undefined> {
    const db = await dbPromise;
    const tx = await db.transaction(['history', 'example']);

    const historyItems = await tx.objectStore('history').getAll(undefined, 1);
    if (historyItems.length > 0) {
        return processEntry(historyItems[0]);
    }

    const exampleEntries = await tx.objectStore('example').getAll();
    const hiddenExamples = new Set(
        exampleEntries.filter(item => item.hidden).map(item => item.id),
    );
    const visibleExample = Array.from(EXAMPLES.values()).find(
        example => !hiddenExamples.has(example.timestamp),
    );
    return visibleExample || undefined;
}

/**
 * Delete a history item with the given timestamp
 */
export async function deleteItemFromDB(timestamp: number) {
    const db = await dbPromise;
    if (timestamp < 10) {
        await db.put('example', { id: timestamp, hidden: true });
    } else {
        await db.delete('history', timestamp);
    }
}

/**
 * Load the history list.
 * @param callback Called on each iteration.
 */
export async function loadHistoryFromDB(
    callback: (entry: PaletteEntry[]) => void,
) {
    const db = await dbPromise;
    const tx = await db.transaction(['history', 'example']);

    await Promise.all([
        tx
            .objectStore('example')
            .getAll()
            .then(async deletedExamples => {
                const examples = new Map(EXAMPLES);
                for (const { id } of deletedExamples) {
                    examples.delete(id);
                }
                callback(Array.from(examples.values()));
            }),
        tx
            .objectStore('history')
            .openCursor()
            .then(async cursor => {
                while (cursor) {
                    callback([processEntry(cursor.value)!]);
                    cursor = await cursor.continue();
                }
            }),
    ]);
}

/**
 * Save items to the database.
 * Items may have object URLs as `imgSrc` properties, and will be processed
 * into data URIs.
 */
export async function saveItemsToDB(
    items: ReadonlyArray<PaletteEntry>,
): Promise<HistoryEntry[]> {
    // Need to process entries first due to IDB restrictions
    const entries = await Promise.all(
        items.map(async item => {
            const blob = await fetch(item.imgSrc).then(r => r.blob());
            const dataUri = await blobToDataUri(blob);
            revokeIfObjectUrl(item.imgSrc);
            return {
                id: item.timestamp,
                imgSrc: dataUri,
                colors: item.colors,
                name: item.name,
            };
        }),
    );

    const db = await dbPromise;
    const { store, done } = await db.transaction('history', 'readwrite');
    entries.forEach(entry => store.put(entry));
    await done;

    return entries;
}
