import { PaletteEntry } from '../entry';
import { UiAction } from '../page/handle-message';
import { processEntry } from './db';
import { deleteItemFromDB, loadItemFromDB } from './display';
import { loadHistoryFromDB, saveItemsToDB } from './history';

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
    payload: number;
}

interface DeleteAction {
    type: 'DELETE';
    payload: number;
}

export type WorkerAction = SaveAction | LoadAction | OpenAction | DeleteAction;

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
                        payload: processEntry(entries[0]),
                    });
                    postMessage({
                        type: 'ADD',
                        payload: entries.map(processEntry),
                    });
                }
                return;
            case 'LOAD':
                await loadHistoryFromDB(entry =>
                    postMessage({ type: 'ADD', payload: [entry] }),
                );
                return;
            case 'OPEN':
                if (!Number.isNaN(action.payload)) {
                    const entry = await loadItemFromDB(action.payload);
                    postMessage({ type: 'DISPLAY', payload: entry });
                }
                return;
            case 'DELETE':
                if (!Number.isNaN(action.payload)) {
                    await deleteItemFromDB(action.payload);
                    postMessage({ type: 'REMOVE', payload: [action.payload] });
                }
                return;
        }
    } catch (err) {
        postMessage({ type: 'ERROR', payload: String(err) });
    }
}
