import { render, h } from 'preact';
import { PaletteEntry } from '../entry';
import { displayBackButton, goBack } from './back-button';
import { renderImage } from './render-image';
import { ViewerColors } from '../components/viewer-colors';

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
const MAIN_PALETTE_COLOR_WRAPPER = document.querySelector(
    '.palette-colors-wrapper',
)!;
const TITLE = 'Color Breakdown';

function closeMainPalette() {
    MAIN_PALETTE_ELEMENT.classList.remove('is-open'); // Close on mobile

    // Update history
    history.replaceState(false, TITLE, '.');
    document.title = TITLE;
}

export function displayMainPalette(props: DisplayMainPaletteProps) {
    displayBackButton(props);

    // Show the selected image or a placeholder
    if (props.data) {
        render(
            <ViewerColors colors={props.data.colors} />,
            MAIN_PALETTE_COLOR_WRAPPER,
        );
        renderImage(props.data, MAIN_PALETTE_IMAGE);

        MAIN_PALETTE_ELEMENT.classList.add('is-open'); // Open on mobile
        const title = `${props.data.name} | ${TITLE}`;
        document.title = title;

        if (props.updateHash) {
            history.replaceState(true, title, `#${props.data.timestamp}`);
        }
    } else {
        render(<ViewerColors colors={undefined} />, MAIN_PALETTE_COLOR_WRAPPER);
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
