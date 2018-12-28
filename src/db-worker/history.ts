import { PaletteEntry } from '../entry';
import { revokeIfObjectUrl } from '../revoke-object-url';
import { blobToDataUri } from './data-uri';
import {
    HistoryEntry,
    openExample,
    openHistory,
    openHistoryAndExample,
    processEntry,
} from './db';
import { examples } from './examples';

/**
 * Loads a single history item for the main palette viewer
 */
export async function loadItemFromDB(
    timestamp: number,
): Promise<PaletteEntry | null> {
    if (timestamp < 10) {
        const { store } = await openExample('readonly');
        const info = await store.get(timestamp);
        const hidden = info != null ? info.hidden : false;
        return hidden ? null : examples[timestamp] || null;
    } else {
        const { store } = await openHistory('readonly');
        const item = await store.get(timestamp);
        return processEntry(item);
    }
}

export async function openFirstItem(): Promise<PaletteEntry | null> {
    const { history, example } = await openHistoryAndExample('readonly');
    const historyItems = await history.getAll(undefined, 1);
    if (historyItems.length > 0) {
        return processEntry(historyItems[0]);
    }

    const hiddenExamples = new Set(
        (await example.getAll())
            .filter(item => item.hidden)
            .map(item => item.id),
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
    if (timestamp < 10) {
        const { store, complete } = await openExample('readwrite');
        store.put({ id: timestamp, hidden: true });
        await complete;
    } else {
        const { store, complete } = await openHistory('readwrite');
        store.delete(timestamp);
        await complete;
    }
}

/**
 * Load the history list.
 * @param callback Called on each iteration.
 */
export async function loadHistoryFromDB(
    exampleCb: (id: number) => void,
    historyCb: (entry: PaletteEntry) => void,
) {
    const { history, example, complete } = await openHistoryAndExample(
        'readonly',
    );

    example.iterateCursor(cursor => {
        if (!cursor) return;
        if (cursor.value.hidden) {
            exampleCb(cursor.key as number);
        }
        cursor.continue();
    });
    history.iterateCursor(cursor => {
        if (!cursor) return;
        historyCb(processEntry(cursor.value));
        cursor.continue();
    });

    await complete;
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

    const { store, complete } = await openHistory('readwrite');
    entries.forEach(entry => store.put(entry));
    await complete;

    return entries;
}
