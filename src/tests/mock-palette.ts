import { ColorPalette } from '../color-interfaces';
import {
    COLOR_CLASSES,
    PaletteProps,
    renderPalette,
} from '../page/render-palette';

/**
 * Mocks a palette element for testing. Includes helper methods to make tests
 * easier to write.
 * @param text When true, add a `.swatch-text` child element to each swatch.
 */
export function createPalette({ text = false } = {}) {
    const element = document.createElement('div');
    element.id = 'palette';
    const swatches: Partial<Record<keyof ColorPalette, HTMLElement>> = {};
    for (const [propName, className] of COLOR_CLASSES) {
        const swatch = document.createElement('span');
        swatch.className = `swatch ${className}`;
        if (text) {
            const swatchText = document.createElement('span');
            swatchText.className = 'swatch-text';
            swatch.appendChild(swatchText);
        }

        element.appendChild(swatch);
        swatches[propName] = swatch;
    }

    return {
        element,
        ...(swatches as Record<keyof ColorPalette, HTMLElement>),
        forEach(cb: (swatch: HTMLElement) => void) {
            for (const className of COLOR_CLASSES.values()) {
                cb(element.querySelector<HTMLElement>(`.swatch.${className}`)!);
            }
        },
        render(props: PaletteProps) {
            return renderPalette(props, element);
        },
    };
}
