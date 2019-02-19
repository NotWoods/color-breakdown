import { DBSchema, openDb } from 'idb';
import { HistoryEntry, PaletteEntry } from '../entry';
import { revokeIfObjectUrl } from '../revoke-object-url';
import { blobToDataUri, dataUriToBlob } from './data-uri';
import { examples } from './examples';

interface ColorBreakdownDBSchema extends DBSchema {
    history: {
        key: number;
        value: HistoryEntry;
    };
    example: {
        key: number;
        value: {
            id: number;
            hidden: true;
        };
    };
}

export const dbPromise = openDb<ColorBreakdownDBSchema>('history-store', 2, {
    upgrade(upgradeDB, oldVersion) {
        switch (oldVersion) {
            case 0:
                upgradeDB.createObjectStore('history', {
                    keyPath: 'id',
                });
            // fall through
            case 1:
                upgradeDB.createObjectStore('example', {
                    keyPath: 'id',
                });
            // fall through
        }
    },
});

export function processEntry(entry: HistoryEntry): PaletteEntry;
export function processEntry(
    entry: HistoryEntry | null | undefined,
): PaletteEntry | null;
export function processEntry(
    entry: HistoryEntry | null | undefined,
): PaletteEntry | null {
    if (entry == null) {
        return null;
    }
    const timestamp = entry.id as number;
    const imgBlob = dataUriToBlob(entry.imgSrc);
    return {
        timestamp,
        imgSrc: URL.createObjectURL(imgBlob),
        colors: entry.colors,
        name: entry.name || new Date(timestamp).toLocaleString(),
    };
}

/**
 * Loads a single history item for the main palette viewer
 */
export async function loadItemFromDB(
    timestamp: number,
): Promise<PaletteEntry | null> {
    const db = await dbPromise;
    const tx = await db.transaction(name, 'readonly');
    if (timestamp < 10) {
        const info = await tx.objectStore('example').get(timestamp);
        const hidden = info != null ? info.hidden : false;
        return hidden ? null : examples[timestamp] || null;
    } else {
        const item = await tx.objectStore('history').get(timestamp);
        return processEntry(item);
    }
}

export async function openFirstItem(): Promise<PaletteEntry | null> {
    const db = await dbPromise;
    const tx = await db.transaction(['history', 'example'], 'readonly');

    const historyItems = await tx.objectStore('history').getAll(undefined, 1);
    if (historyItems.length > 0) {
        return processEntry(historyItems[0]);
    }

    const exampleEntries = await tx.objectStore('example').getAll();
    const hiddenExamples = new Set(
        exampleEntries.filter(item => item.hidden).map(item => item.id),
    );
    const visibleExample = Object.values(examples).find(
        example => !hiddenExamples.has(example.timestamp),
    );
    return visibleExample || null;
}

/**
 * Delete a history item with the given timestamp
 */
export async function deleteItemFromDB(timestamp: number) {
    const db = await dbPromise;
    const tx = await db.transaction(name, 'readwrite');
    if (timestamp < 10) {
        tx.objectStore('example').put({ id: timestamp, hidden: true });
    } else {
        tx.objectStore('history').delete(timestamp);
    }
    await tx.done;
}

/**
 * Load the history list.
 * @param callback Called on each iteration.
 */
export async function loadHistoryFromDB(
    exampleCb: (id: number) => void,
    historyCb: (entry: PaletteEntry) => void,
) {
    const db = await dbPromise;
    const tx = await db.transaction(['history', 'example'], 'readonly');
    await Promise.all([
        tx
            .objectStore('example')
            .openCursor()
            .then(async cursor => {
                while (cursor) {
                    if (cursor.value.hidden) {
                        exampleCb(cursor.key);
                    }
                    cursor = await cursor.continue();
                }
            }),
        tx
            .objectStore('history')
            .openCursor()
            .then(async cursor => {
                while (cursor) {
                    historyCb(processEntry(cursor.value)!);
                    cursor = await cursor.continue();
                }
            }),
    ]);
}

/**
 * Equivalent to `fetch(url).then(r => r.blob())`.
 * Firefox 64 crashes when fetching an object URL as a blob.
 * TODO: Replace once Firefox 65 is out.
 */
function fetchBlob(url: string) {
    return new Promise<Blob>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function() {
            if (this.status === 200) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusText));
            }
        };
        xhr.onerror = function() {
            reject(new Error(this.statusText));
        };
        xhr.send();
    });
}

/**
 * Save items to the database.
 * Items may have object URLs as `imgSrc` properties, and will be processed
 * into data URIs.
 */
export async function saveItemsToDB(
    items: PaletteEntry[],
): Promise<HistoryEntry[]> {
    // Need to process entries first due to IDB restrictions
    const entries = await Promise.all(
        items.map(async item => {
            const blob = await fetchBlob(item.imgSrc);
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
    const tx = await db.transaction('history', 'readwrite');
    const store = tx.objectStore('history');
    entries.forEach(entry => store.put(entry));
    await tx.done;

    return entries;
}
