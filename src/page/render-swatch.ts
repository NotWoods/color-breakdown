import { ColorSwatch } from '../color-interfaces';
import { ColorTextType, getColorText } from './props/color-text';

interface SwatchProps {
    readonly color?: ColorSwatch;
    readonly colorTextType?: ColorTextType;
}

/**
 * Renders a swatch: the element that displays a color for the user to look at.
 */
export function renderSwatch(props: SwatchProps, target: HTMLElement) {
    const isVisible = props.color != undefined;
    const isTextSwatch = props.colorTextType != undefined;
    target.hidden = !isVisible;
    if (isVisible) {
        const { textColor, color: backgroundColor } = props.color!;

        target.style.backgroundColor = backgroundColor;
        if (isTextSwatch) {
            target.style.color = textColor;
            target.querySelector('.swatch-text')!.textContent = getColorText({
                colorTextType: props.colorTextType!,
                hexColor: backgroundColor,
            });
        }
    }
}
