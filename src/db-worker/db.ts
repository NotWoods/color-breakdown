import idb from 'idb';
import { ColorPalette } from '../color-interfaces';
import { PaletteEntry } from '../entry';
import { dataUriToBlob } from './data-uri';

export interface HistoryEntry {
    readonly id: number;
    readonly imgSrc: string;
    readonly colors: ColorPalette;
}

interface ExampleEntry {
    id: number;
    hidden: true;
}

const dbPromise = idb.open('history-store', 1, upgradeDB => {
    switch (upgradeDB.oldVersion) {
        case 0:
            upgradeDB.createObjectStore<HistoryEntry, number>('history', {
                keyPath: 'id',
            });
        // fall through
        case 1:
            upgradeDB.createObjectStore<ExampleEntry, number>('example', {
                keyPath: 'id',
            });
        // fall through
    }
});

async function open<T>(name: string, mode: 'readonly' | 'readwrite') {
    const db = await dbPromise;
    const tx = await db.transaction(name, mode);
    const store = tx.objectStore<T, number>(name);

    return { store, complete: tx.complete };
}

/**
 * Open the history object store.
 * @returns object with `store` property and inner promise `complete` which
 * resolves once the transaction is complete.
 */
export function openHistory(mode: 'readonly' | 'readwrite') {
    return open<HistoryEntry>('history', mode);
}

export function openExample(mode: 'readonly' | 'readwrite') {
    return open<ExampleEntry>('example', mode);
}

/**
 * Open the history and example object stores.
 */
export async function openHistoryAndExample(mode: 'readonly' | 'readwrite') {
    const db = await dbPromise;
    const tx = await db.transaction(['history', 'example'], mode);

    return {
        history: tx.objectStore<HistoryEntry, number>('history'),
        example: tx.objectStore<ExampleEntry, number>('example'),
        complete: tx.complete,
    };
}

export function processEntry(entry: HistoryEntry): PaletteEntry;
export function processEntry(entry: null | undefined): null;
export function processEntry(
    entry: HistoryEntry | null | undefined,
): PaletteEntry | null {
    if (entry == null) {
        return null;
    }
    const imgBlob = dataUriToBlob(entry.imgSrc);
    return {
        timestamp: entry.id as number,
        imgSrc: URL.createObjectURL(imgBlob),
        colors: entry.colors,
    };
}
