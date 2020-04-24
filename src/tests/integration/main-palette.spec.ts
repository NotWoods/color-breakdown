import { createPalette } from '../mock-palette';
const MAIN_PALETTE = createPalette({ text: true });
const MAIN_PALETTE_IMAGE = Object.assign(document.createElement('img'), {
    className: 'preview',
});
const COLOR_DISPLAY_SELECT = Object.assign(document.createElement('select'), {
    id: 'color-display',
});
const BACK_BUTTON = Object.assign(document.createElement('button'), {
    id: 'back',
});
MAIN_PALETTE.element.appendChild(MAIN_PALETTE_IMAGE);
MAIN_PALETTE.element.appendChild(COLOR_DISPLAY_SELECT);
document.body.appendChild(MAIN_PALETTE.element);
document.body.appendChild(BACK_BUTTON);

import { displayMainPalette, handleBackButton } from '../../page/main-palette';
import { EXAMPLES } from '../../db-worker/examples';

BACK_BUTTON.addEventListener('click', handleBackButton);

describe('Main Palette Integration Test', () => {
    test('render placeholder', () => {
        displayMainPalette({
            data: undefined,
            firstLoad: true,
            updateHash: false,
        });

        // Preview should show placeholder image
        expect(new URL(MAIN_PALETTE_IMAGE.src).pathname).toBe(
            '/img/placeholder.svg',
        );
        expect(MAIN_PALETTE_IMAGE.alt).toBe('No image');

        expect(BACK_BUTTON.dataset.firstload).toBeDefined();

        expect(MAIN_PALETTE.element.classList.contains('is-open')).toBe(false);
        MAIN_PALETTE.forEach((swatch) => expect(swatch.hidden).toBe(true));
    });

    test('render example', () => {
        displayMainPalette({
            data: EXAMPLES.get(1),
            firstLoad: false,
            updateHash: true,
        });

        expect(new URL(MAIN_PALETTE_IMAGE.src).pathname).toBe(
            '/img/demo/andrew-hughes-261571-unsplash.jpg',
        );
        expect(MAIN_PALETTE_IMAGE.alt).toBe(
            'Photo by Andrew Hughes on Unsplash',
        );

        expect(BACK_BUTTON.dataset.firstload).not.toBeDefined();

        expect(MAIN_PALETTE.element.classList.contains('is-open')).toBe(true);
        MAIN_PALETTE.forEach((swatch) => expect(swatch.hidden).toBe(false));
    });

    test.skip('change displayed text', async () => {
        expect(MAIN_PALETTE.vibrant.textContent).toContain('#AE340E');

        COLOR_DISPLAY_SELECT.value = 'RGB';
        await new Promise(setImmediate);

        expect(MAIN_PALETTE.vibrant.textContent).not.toContain('#AE340E');
        expect(MAIN_PALETTE.vibrant.textContent).toContain('rgb(');
    });
});
