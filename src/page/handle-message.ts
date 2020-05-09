import { PaletteEntry } from '../entry';
import { addPalettesToList, deletePalettesFromList } from './list';
import { displayMainPalette } from './main-palette';
import { WorkerAction } from '../db-worker/handle-message';

interface AddAction {
    readonly type: 'ADD';
    readonly payload: readonly PaletteEntry[];
}

interface RemoveAction {
    readonly type: 'REMOVE';
    readonly payload: readonly number[];
}

interface DisplayAction {
    readonly type: 'DISPLAY';
    readonly payload: {
        readonly entry?: PaletteEntry;
        readonly firstLoad: boolean;
    };
}

interface ErrorAction {
    readonly type: 'ERROR';
    readonly payload: string;
}

export type UiAction = AddAction | RemoveAction | DisplayAction | ErrorAction;

export function handleMessage(
    action: UiAction,
    postMessage: (action: WorkerAction) => void,
) {
    console.log(action.type, action.payload);
    switch (action.type) {
        case 'ADD':
            addPalettesToList({ items: action.payload });
            return;
        case 'REMOVE':
            deletePalettesFromList({ timestamps: action.payload });
            return;
        case 'DISPLAY':
            displayMainPalette({
                data: action.payload.entry,
                firstLoad: action.payload.firstLoad,
                postMessage,
            });
            return;
        case 'ERROR':
            console.error(action.payload);
            return;
    }
}
