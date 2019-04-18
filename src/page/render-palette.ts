import { ColorTextType } from './render-color-text';
import { ColorPalette } from '../color-interfaces';
import { renderSwatch } from './render-swatch';

export interface PaletteProps {
    readonly colors?: ColorPalette;
    readonly colorTextType?: ColorTextType;
}

export const COLOR_CLASSES: ReadonlyMap<keyof ColorPalette, string> = new Map(
    Object.entries({
        vibrant: 'vibrant',
        darkVibrant: 'dark-vibrant',
        lightVibrant: 'light-vibrant',
        muted: 'muted',
        darkMuted: 'dark-muted',
        lightMuted: 'light-muted',
    }) as [keyof ColorPalette, string][],
);

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
