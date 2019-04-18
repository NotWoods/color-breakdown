import { PaletteEntry } from '../entry';
import { displayBackButton, goBack } from './back-button';
import { ColorTextType } from './render-color-text';
import { renderImage } from './render-image';
import { renderPalette } from './render-palette';

interface DisplayMainPaletteProps {
    /** Data to display on the main palette */
    readonly data?: PaletteEntry;
    /**
     * True if this image was loaded when the document loaded.
     * Changes back button behavior so that it doesn't navigate away
     * from the page accidentally.
     */
    readonly firstLoad: boolean;
    /**
     * True if the page URL should be updated with this image's ID.
     * Unnecessary if a link was clicked to open this image.
     */
    readonly updateHash: boolean;
}

const MAIN_PALETTE_ELEMENT = document.querySelector('#palette')!;
const MAIN_PALETTE_IMAGE = MAIN_PALETTE_ELEMENT.querySelector<HTMLImageElement>(
    'img.preview',
)!;
const COLOR_DISPLAY_SELECT = document.querySelector<HTMLSelectElement>(
    '#color-display',
)!;
const TITLE = 'Color Breakdown';

function closeMainPalette() {
    MAIN_PALETTE_ELEMENT.classList.remove('is-open'); // Close on mobile

    // Update history
    history.replaceState(false, TITLE, '.');
    document.title = TITLE;
}

/** Stores current select change listener so it can be replaced later */
let listener: (() => void) | undefined = undefined;

export function displayMainPalette(props: DisplayMainPaletteProps) {
    if (listener) {
        COLOR_DISPLAY_SELECT.removeEventListener('change', listener);
    }

    const colorTextType = COLOR_DISPLAY_SELECT.value as ColorTextType;
    displayBackButton(props);

    // Show the selected image or a placeholder
    if (props.data) {
        function render() {
            renderPalette(
                { ...props.data!, colorTextType },
                MAIN_PALETTE_ELEMENT,
            );
        }
        render();
        renderImage(props.data, MAIN_PALETTE_IMAGE); // Only render image first time
        COLOR_DISPLAY_SELECT.addEventListener('change', render);
        listener = render;

        MAIN_PALETTE_ELEMENT.classList.add('is-open'); // Open on mobile
        const title = `${props.data.name} | ${TITLE}`;
        document.title = title;

        if (props.updateHash) {
            history.replaceState(true, title, `#${props.data.timestamp}`);
        }
    } else {
        renderPalette(
            { colors: undefined, colorTextType },
            MAIN_PALETTE_ELEMENT,
        );
        renderImage(
            { imgSrc: 'img/placeholder.svg', name: 'No image' },
            MAIN_PALETTE_IMAGE,
        );
        listener = undefined;
        closeMainPalette();
    }
}

export function handleBackButton() {
    goBack();
    closeMainPalette();
}
