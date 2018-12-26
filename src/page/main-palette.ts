import { PaletteEntry } from '../entry';
import { ColorTextType } from './render-color-text';
import { renderImage } from './render-image';
import { renderPalette } from './render-palette';

interface MainPaletteProps {
    data: PaletteEntry | null;
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

function toHome() {
    if (historyStack.length > 0) {
        history.back();
    }
    history.replaceState(false, TITLE, '.');
}

let listener: (() => void) | null = null;

export function displayMainPalette(props: MainPaletteProps) {
    if (listener) {
        COLOR_DISPLAY_SELECT.removeEventListener('change', listener);
    }
    if (props.data != null) {
        function render() {
            renderPalette(
                {
                    ...props.data!,
                    colorTextType: COLOR_DISPLAY_SELECT.value as ColorTextType,
                },
                MAIN_PALETTE_ELEMENT,
            );
        }
        render();
        renderImage(props.data, MAIN_PALETTE_IMAGE); // Only render image first time
        COLOR_DISPLAY_SELECT.addEventListener('change', render);
        listener = render;

        MAIN_PALETTE_ELEMENT.classList.add('is-open'); // Open on mobile
        // Update history
        const { timestamp } = props.data;
        if (LARGE_SCREEN.matches) {
            history.replaceState(true, TITLE, `#${timestamp}`);
        } else {
            history.pushState(true, TITLE, `#${timestamp}`);
            historyStack.push(timestamp);
        }
    } else {
        renderPalette({
            colors: null,
            colorTextType: COLOR_DISPLAY_SELECT.value as ColorTextType,
        }, MAIN_PALETTE_ELEMENT);
        renderImage(
            { imgSrc: 'img/placeholder.svg', alt: 'No image' },
            MAIN_PALETTE_IMAGE,
        );
        listener = null;

        MAIN_PALETTE_ELEMENT.classList.remove('is-open'); // Close on mobile
        toHome(); // Update history
    }
}

export function handleBackClick(evt: MouseEvent) {
    evt.preventDefault();
    MAIN_PALETTE_ELEMENT.classList.remove('is-open'); // Close on mobile

    toHome(); // Update history
}
