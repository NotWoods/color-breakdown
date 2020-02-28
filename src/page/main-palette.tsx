import { h, render } from 'preact';
import { PaletteEntry } from '../entry';
import { displayBackButton, goBack } from './back-button';
import { MainPalette } from './components/palette';
import { renderImage } from './render-image';

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
const COLOR_DISPLAY_CONTAINER = document.querySelector(
    '.palette-colors-wrapper',
)!;
const TITLE = 'Color Breakdown';

function closeMainPalette() {
    MAIN_PALETTE_ELEMENT.classList.remove('is-open'); // Close on mobile

    // Update history
    history.replaceState(false, TITLE, '.');
    document.title = TITLE;
}

let firstLoad = true;

export function displayMainPalette(props: DisplayMainPaletteProps) {
    displayBackButton(props);

    if (firstLoad) {
        firstLoad = false;
        while (COLOR_DISPLAY_CONTAINER.firstChild) {
            COLOR_DISPLAY_CONTAINER.removeChild(
                COLOR_DISPLAY_CONTAINER.firstChild,
            );
        }
    }

    // Show the selected image or a placeholder
    if (props.data) {
        render(
            <MainPalette palette={props.data.colors} />,
            COLOR_DISPLAY_CONTAINER,
        );
        renderImage(props.data, MAIN_PALETTE_IMAGE); // Only render image first time

        MAIN_PALETTE_ELEMENT.classList.add('is-open'); // Open on mobile
        const title = `${props.data.name} | ${TITLE}`;
        document.title = title;

        if (props.updateHash) {
            history.replaceState(true, title, `#${props.data.timestamp}`);
        }
    } else {
        render(<MainPalette />, COLOR_DISPLAY_CONTAINER);
        renderImage(
            { imgSrc: 'img/placeholder.svg', name: 'No image' },
            MAIN_PALETTE_IMAGE,
        );
        closeMainPalette();
    }
}

export function handleBackButton() {
    goBack();
    closeMainPalette();
}
