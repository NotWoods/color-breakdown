import { PaletteEntry } from '../entry';
import { UiAction } from '../page/handle-message';
import { HistoryEntry, processEntry } from './db';
import {
    deleteItemFromDB,
    loadHistoryFromDB,
    loadItemFromDB,
    openFirstItem,
    saveItemsToDB,
} from './history';

interface SaveAction {
    type: 'SAVE';
    payload: PaletteEntry[];
}

interface LoadAction {
    type: 'LOAD';
    payload: null;
}

interface OpenAction {
    type: 'OPEN';
    payload: {
        timestamp: number;
        firstLoad: boolean;
    };
}

interface DeleteAction {
    type: 'DELETE';
    payload: {
        timestamp: number;
        current: boolean;
    };
}

export type WorkerAction = SaveAction | LoadAction | OpenAction | DeleteAction;
type ProcessEntry = (entry: HistoryEntry) => PaletteEntry;

export async function handleMessage(
    action: WorkerAction,
    postMessage: (msg: UiAction) => void,
) {
    console.log(action.type, action.payload);
    try {
        switch (action.type) {
            case 'SAVE':
                if (action.payload.length > 0) {
                    const entries = await saveItemsToDB(action.payload);
                    postMessage({
                        type: 'DISPLAY',
                        payload: {
                            entry: processEntry(entries[0]),
                            firstLoad: false,
                        },
                    });
                    postMessage({
                        type: 'ADD',
                        payload: entries.map(processEntry as ProcessEntry),
                    });
                }
                return;
            case 'LOAD':
                await loadHistoryFromDB(
                    id => postMessage({ type: 'REMOVE', payload: [id] }),
                    entry => postMessage({ type: 'ADD', payload: [entry] }),
                );
                return;
            case 'OPEN':
                if (!Number.isNaN(action.payload.timestamp)) {
                    const entry = await loadItemFromDB(
                        action.payload.timestamp,
                    );
                    if (entry != null) {
                        postMessage({
                            type: 'DISPLAY',
                            payload: {
                                entry,
                                firstLoad: action.payload.firstLoad,
                            },
                        });
                    }
                }
                return;
            case 'DELETE':
                if (!Number.isNaN(action.payload.timestamp)) {
                    await deleteItemFromDB(action.payload.timestamp);
                    postMessage({
                        type: 'REMOVE',
                        payload: [action.payload.timestamp],
                    });
                    if (action.payload.current) {
                        const otherEntry = await openFirstItem();
                        postMessage({
                            type: 'DISPLAY',
                            payload: {
                                entry: otherEntry,
                                firstLoad: false,
                            },
                        });
                    }
                }
                return;
        }
    } catch (err) {
        postMessage({ type: 'ERROR', payload: String(err) });
    }
}
