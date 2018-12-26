import { PaletteEntry } from '../entry';
import { revokeIfObjectUrl } from '../revoke-object-url';
import { blobToDataUri } from './data-uri';
import { openHistory, openExample, processEntry, HistoryEntry } from './db';

/**
 * Load the history list.
 * @param callback Called on each iteration.
 */
export async function loadHistoryFromDB(
    callback: (entry: PaletteEntry) => void,
) {
    const { store, complete } = await openHistory('readonly');

    store.iterateCursor(cursor => {
        if (!cursor) return;
        callback(processEntry(cursor.value));
        cursor.continue();
    });
    await complete;
}

export async function hideExamples(callback: (id: number) => void) {
    const { store, complete } = await openExample('readonly');

    store.iterateCursor(cursor => {
        if (!cursor) return;
        if (cursor.value.hidden) {
            callback(cursor.key as number);
        }
        cursor.continue();
    });
    await complete;
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
            const res = await fetch(item.imgSrc);
            const blob = await res.blob();
            const dataUri = await blobToDataUri(blob);
            revokeIfObjectUrl(item.imgSrc);
            return {
                id: item.timestamp,
                imgSrc: dataUri,
                colors: item.colors,
            };
        }),
    );

    const { store, complete } = await openHistory('readwrite');
    entries.forEach(entry => store.put(entry));
    await complete;

    return entries;
}
