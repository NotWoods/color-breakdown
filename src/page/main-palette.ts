import { PaletteEntry } from '../entry';
import { ColorTextType } from './render-color-text';
import { renderImage } from './render-image';
import { renderPalette } from './render-palette';

interface DisplayMainPaletteProps {
    data: PaletteEntry | null;
    firstLoad: boolean;
}

const MAIN_PALETTE_ELEMENT = document.getElementById('palette')!;
const MAIN_PALETTE_IMAGE = MAIN_PALETTE_ELEMENT.querySelector<HTMLImageElement>(
    'img.preview',
)!;
const COLOR_DISPLAY_SELECT = document.getElementById(
    'color-display',
) as HTMLSelectElement;
const BACK_BUTTON = document.getElementById('back')!;
const TITLE = 'Color Breakdown';

function closeMainPalette() {
    MAIN_PALETTE_ELEMENT.classList.remove('is-open'); // Close on mobile

    // Update history
    history.replaceState(false, TITLE, '.');
    document.title = TITLE;
}

/** Stores current select change listener so it can be replaced later */
let listener: (() => void) | null = null;

export function displayMainPalette(props: DisplayMainPaletteProps) {
    if (listener) {
        COLOR_DISPLAY_SELECT.removeEventListener('change', listener);
    }

    if (props.firstLoad) {
        BACK_BUTTON.dataset.firstload = 'firstload';
    } else {
        delete BACK_BUTTON.dataset.firstload;
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
        document.title = `${props.data.name} | ${TITLE}`;
    } else {
        renderPalette(
            {
                colors: null,
                colorTextType: COLOR_DISPLAY_SELECT.value as ColorTextType,
            },
            MAIN_PALETTE_ELEMENT,
        );
        renderImage(
            { imgSrc: 'img/placeholder.svg', name: 'No image' },
            MAIN_PALETTE_IMAGE,
        );
        listener = null;
        closeMainPalette();
    }
}

export function handleBackButton() {
    if (!BACK_BUTTON.dataset.firstload) {
        history.back();
    }
    closeMainPalette();
}
