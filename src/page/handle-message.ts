import { PaletteEntry } from '../entry';
import { addPalettesToList, deletePalettesFromList } from './list';
import { displayMainPalette } from './main-palette';

interface AddAction {
    readonly type: 'ADD';
    readonly payload: ReadonlyArray<PaletteEntry>;
}

interface RemoveAction {
    readonly type: 'REMOVE';
    readonly payload: ReadonlyArray<number>;
}

interface DisplayAction {
    readonly type: 'DISPLAY';
    readonly payload: {
        readonly entry?: PaletteEntry;
        readonly firstLoad: boolean;
        readonly updateHash: boolean;
    };
}

interface ErrorAction {
    readonly type: 'ERROR';
    readonly payload: string;
}

export type UiAction = AddAction | RemoveAction | DisplayAction | ErrorAction;

export function handleMessage(action: UiAction) {
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
                updateHash: action.payload.updateHash,
            });
            return;
        case 'ERROR':
            console.error(action.payload);
            return;
    }
}
