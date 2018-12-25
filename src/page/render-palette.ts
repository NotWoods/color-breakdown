import { ColorTextType } from './render-color-text';
import { ColorPalette } from '../color-interfaces';
import { renderSwatch } from './render-swatch';

interface PaletteProps {
    timestamp: number;
    imgSrc: string;
    colors: ColorPalette;
    colorTextType: ColorTextType | null;
}

const colorClasses: Record<keyof ColorPalette, string> = Object.freeze({
    vibrant: 'vibrant',
    darkVibrant: 'dark-vibrant',
    lightVibrant: 'light-vibrant',
    muted: 'muted',
    darkMuted: 'dark-muted',
    lightMuted: 'light-muted',
});

/**
 * Renders a palette - the associated colors of an image.
 */
export function renderPalette(props: PaletteProps, target: ParentNode) {
    for (const [propName, className] of Object.entries(colorClasses)) {
        const swatchTarget = target.querySelector<HTMLElement>(
            `.swatch.${className}`,
        )!;
        renderSwatch(
            {
                colorTextType: props.colorTextType,
                color: props.colors[propName as keyof ColorPalette],
            },
            swatchTarget,
        );
    }
}
