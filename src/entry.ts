import { ColorPalette } from './color-interfaces';

export interface PaletteEntry {
    readonly timestamp: number;
    readonly imgSrc: string;
    readonly colors: ColorPalette;
}
