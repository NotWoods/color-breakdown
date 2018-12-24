import { ColorTextType } from './render-color-text';
import { ColorPalette } from '../color-interfaces';
import { renderSwatch } from './render-swatch';

interface PaletteProps {
    timestamp: number;
    imgSrc: string;
    colors: ColorPalette;
    colorTextType: ColorTextType | null;
}

const colorClasses = Object.freeze({
    vibrant: 'vibrant',
    darkVibrant: 'dark-vibrant',
    lightVibrant: 'light-vibrant',
    muted: 'muted',
    darkMuted: 'dark-muted',
    lightMuted: 'light-muted',
});

/**
 * Renders a palette - a group of an image and the associated colors.
 */
export function renderPalette(props: PaletteProps, target: ParentNode) {
    const preview = target.querySelector<HTMLImageElement>('img.preview')!;
    preview.src = props.imgSrc;
    preview.alt = new Date(props.timestamp).toLocaleString();

    for (const [propName, className] of Object.entries(colorClasses)) {
        const swatchTarget = target.querySelector<HTMLElement>(className)!;
        renderSwatch(
            {
                colorTextType: props.colorTextType,
                color: props.colors[propName as keyof typeof colorClasses],
            },
            swatchTarget,
        );
    }
}
