import { PaletteEntry } from '../entry';
import {
    openHistory,
    processEntry,
    openExample,
    openHistoryAndExample,
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
    const { history, example } = await openHistoryAndExample(
        'readonly',
    );
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
