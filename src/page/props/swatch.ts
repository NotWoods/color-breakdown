import { JSX } from 'preact';
import { ColorSwatch } from '../../color-interfaces';

interface SwatchProps<T extends HTMLElement> extends JSX.HTMLAttributes<T> {
    style: { [key: string]: string | number };
}

/**
 * Returns HTML attributes to apply to swatch elements
 * @param swatch
 */
export function getSwatchProps<T extends HTMLElement>(
    swatch: ColorSwatch | undefined,
): SwatchProps<T> {
    if (swatch) {
        return {
            hidden: false,
            style: {
                backgroundColor: swatch.color,
                color: swatch.textColor,
            },
        };
    }
    return {
        hidden: true,
        style: {},
    };
}
