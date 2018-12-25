import { PaletteEntry } from '../entry';
import { openHistory, processEntry, openExample } from './db';

/**
 * Loads a single history item for the main palette viewer
 */
export async function loadItemFromDB(
    timestamp: number,
): Promise<PaletteEntry | null> {
    const { store } = await openHistory('readonly');
    const item = await store.get(timestamp);

    return processEntry(item);
}

/**
 * Delete a history item with the given timestamp
 */
export async function deleteItemFromDB(timestamp: number) {
    const { store, complete } = await (timestamp < 10
        ? openExample('readwrite')
        : openHistory('readwrite'));
    store.delete(timestamp);
    await complete;
}
