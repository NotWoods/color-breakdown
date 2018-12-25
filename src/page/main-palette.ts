import { renderPalette } from './render-palette';
import { ColorPalette } from '../color-interfaces';
import { ColorTextType } from './render-color-text';
import { renderImage } from './render-image';

interface MainPaletteProps {
    timestamp: number;
    imgSrc: string;
    colors: ColorPalette;
}

const MAIN_PALETTE_ELEMENT = document.getElementById('palette')!;
const MAIN_PALETTE_IMAGE = MAIN_PALETTE_ELEMENT.querySelector<HTMLImageElement>(
    'img.preview',
)!;
const COLOR_DISPLAY_SELECT = document.getElementById(
    'color-display',
) as HTMLSelectElement;
const LARGE_SCREEN = matchMedia('(min-width: 700px)');
const TITLE = 'Color Breakdown';

// Tracks history items on this site
const historyStack = [];

let listener: (() => void) | null = null;

export function displayMainPalette(props: MainPaletteProps) {
    function render() {
        renderPalette(
            {
                ...props,
                colorTextType: COLOR_DISPLAY_SELECT.value as ColorTextType,
            },
            MAIN_PALETTE_ELEMENT,
        );
    }
    render();
    renderImage(props, MAIN_PALETTE_IMAGE);
    if (listener) {
        COLOR_DISPLAY_SELECT.removeEventListener('change', listener);
    }
    COLOR_DISPLAY_SELECT.addEventListener('change', render);
    listener = render;

    MAIN_PALETTE_ELEMENT.classList.add('is-open'); // Open on mobile
    // Update history
    if (LARGE_SCREEN.matches) {
        history.replaceState(true, TITLE, `#${props.timestamp}`);
    } else {
        history.pushState(true, TITLE, `#${props.timestamp}`);
        historyStack.push(props.timestamp);
    }
}

export function handleBackClick(evt: MouseEvent) {
    evt.preventDefault();
    MAIN_PALETTE_ELEMENT.classList.remove('is-open'); // Close on mobile

    // Update history
    if (historyStack.length > 0) {
        history.back();
    }
    history.replaceState(false, TITLE, '.');
}
