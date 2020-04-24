import { HistoryEntry, PaletteEntry } from '../entry';
import { UiAction } from '../page/handle-message';
import {
    deleteItemFromDB,
    loadHistoryFromDB,
    loadItemFromDB,
    openFirstItem,
    saveItemsToDB,
} from './db';
import { processEntry } from './process-entry';

interface SaveAction {
    readonly type: 'SAVE';
    readonly payload: ReadonlyArray<PaletteEntry>;
}

interface LoadAction {
    readonly type: 'LOAD';
    readonly payload: undefined;
}

interface OpenAction {
    readonly type: 'OPEN';
    readonly payload: {
        readonly timestamp: number;
        readonly firstLoad: boolean;
    };
}

interface DeleteAction {
    readonly type: 'DELETE';
    readonly payload: {
        readonly timestamp: number;
        readonly current: boolean;
    };
}

export type WorkerAction = SaveAction | LoadAction | OpenAction | DeleteAction;
type ProcessEntryFunc = (entry: HistoryEntry) => PaletteEntry;

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
                            updateHash: true,
                        },
                    });
                    postMessage({
                        type: 'ADD',
                        payload: entries.map(processEntry as ProcessEntryFunc),
                    });
                }
                return;
            case 'LOAD':
                await loadHistoryFromDB(
                    (id) => postMessage({ type: 'REMOVE', payload: [id] }),
                    (entry) => postMessage({ type: 'ADD', payload: [entry] }),
                );
                return;
            case 'OPEN':
                let entry: PaletteEntry | undefined = undefined;
                if (!Number.isNaN(action.payload.timestamp)) {
                    entry = await loadItemFromDB(action.payload.timestamp);
                }
                postMessage({
                    type: 'DISPLAY',
                    payload: {
                        entry,
                        firstLoad: action.payload.firstLoad,
                        updateHash: false,
                    },
                });
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
                                updateHash: true,
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
