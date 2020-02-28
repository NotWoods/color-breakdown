import { ColorTextType } from './render-color-text';
import { ColorPalette } from '../color-interfaces';
import { renderSwatch } from './render-swatch';
import { COLOR_CLASSES } from './props/palette';

export interface PaletteProps {
    readonly colors?: ColorPalette;
    readonly colorTextType?: ColorTextType;
}

export { COLOR_CLASSES };

/**
 * Renders a palette - the associated colors of an image.
 */
export function renderPalette(props: PaletteProps, target: ParentNode) {
    const { colors, colorTextType } = props;
    for (const [propName, className] of COLOR_CLASSES) {
        const swatchTarget = target.querySelector<HTMLElement>(
            `.swatch.${className}`,
        )!;
        renderSwatch(
            {
                colorTextType,
                color: colors != undefined ? colors[propName] : undefined,
            },
            swatchTarget,
        );
    }
}
