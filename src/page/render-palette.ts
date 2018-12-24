import { ColorTextType } from './render-color-text';
import { ColorPalette } from '../color-interfaces';
import { renderSwatch } from './render-swatch';

interface PaletteProps {
    imgSrc: string;
    colors: ColorPalette;
    colorTextType: ColorTextType;
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
export function renderPalette(props: PaletteProps, target: Element) {
    const preview = target.querySelector<HTMLImageElement>('img.preview');
    preview.src = props.imgSrc;
    for (const [propName, className] of Object.entries(colorClasses)) {
        const swatchTarget = target.querySelector<HTMLElement>(className);
        renderSwatch(
            {
                colorTextType: props.colorTextType,
                color: props.colors[propName],
            },
            swatchTarget,
        );
    }
}
