import { renderPalette } from './render-palette';
import { ColorPalette } from '../color-interfaces';
import { ColorTextType } from './render-color-text';

interface MainPaletteProps {
    timestamp: number;
    imgSrc: string;
    colors: ColorPalette;
}

const MAIN_PALETTE_ELEMENT = document.getElementById('palette')!;
const COLOR_DISPLAY_SELECT = document.getElementById(
    'color-display',
) as HTMLSelectElement;

export function displayMainPalette(props: MainPaletteProps) {
    renderPalette(
        {
            ...props,
            colorTextType: COLOR_DISPLAY_SELECT.value as ColorTextType,
        },
        MAIN_PALETTE_ELEMENT,
    );

    MAIN_PALETTE_ELEMENT.classList.add('is-open');
    // TODO update window history
}

export function handleBackClick(evt: MouseEvent) {
    evt.preventDefault();
    MAIN_PALETTE_ELEMENT.classList.remove('is-open');
    // TODO update window history
}
