import { PaletteEntry } from '../entry';
import { addPalettesToList, deletePalettesFromList } from './list';
import { displayMainPalette } from './main-palette';

interface AddAction {
    type: 'ADD';
    payload: PaletteEntry[];
}

interface RemoveAction {
    type: 'REMOVE';
    payload: number[];
}

interface DisplayAction {
    type: 'DISPLAY';
    payload: {
        entry: PaletteEntry | null;
        firstLoad: boolean;
        updateHash: boolean;
    };
}

interface ErrorAction {
    type: 'ERROR';
    payload: string;
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
