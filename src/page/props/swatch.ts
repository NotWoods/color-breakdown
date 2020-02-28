import { JSX } from 'preact';
import { ColorSwatch } from '../../color-interfaces';

/**
 * Returns HTML attributes to apply to swatch elements
 * @param swatch
 */
export function getSwatchProps(
    swatch: ColorSwatch | undefined,
): JSX.HTMLAttributes<HTMLElement> {
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
