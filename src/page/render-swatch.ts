import { ColorSwatch } from '../color-interfaces';
import { ColorTextType, renderColorText } from './render-color-text';

interface SwatchProps {
    color: ColorSwatch | null | undefined;
    colorTextType: ColorTextType | null;
}

/**
 * Renders a swatch: the element that displays a color for the user to look at.
 */
export function renderSwatch(props: SwatchProps, target: HTMLElement) {
    const isVisible = props.color != null;
    const isTextSwatch = props.colorTextType != null;
    target.hidden = !isVisible;
    if (isVisible) {
        const { textColor, color: backgroundColor } = props.color!;

        target.style.backgroundColor = backgroundColor;
        if (isTextSwatch) {
            target.style.color = textColor;
            target.querySelector('.swatch-text')!.textContent = renderColorText(
                {
                    colorTextType: props.colorTextType!,
                    hexColor: backgroundColor,
                },
            );
        }
    }
}
