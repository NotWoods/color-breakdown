import { PaletteEntry } from '../entry';
import { revokeIfObjectUrl } from '../revoke-object-url';
import { blobToDataUri } from './data-uri';
import {
    openHistory,
    processEntry,
    HistoryEntry,
    openHistoryAndExample,
} from './db';

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
            let blob: Blob;
            try {
                blob = await fetchBlob(item.imgSrc);
            } catch (err) {
                console.error(err);
                throw err;
            }
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
