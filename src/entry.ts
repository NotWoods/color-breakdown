import { ColorPalette } from './color-interfaces';

export interface PaletteEntry {
    readonly timestamp: number;
    readonly imgSrc: string;
    readonly colors: ColorPalette;
    readonly name: string;
}

export interface HistoryEntry {
    readonly id: number;
    readonly imgSrc: string;
    readonly colors: ColorPalette;
    readonly name?: string;
}
