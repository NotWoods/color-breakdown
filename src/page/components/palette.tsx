import { h, ComponentChild } from 'preact';
import { useState } from 'preact/hooks';
import { ColorPalette } from '../../color-interfaces';
import { getSwatchProps } from '../props/swatch';
import { COLOR_CLASSES } from '../props/palette';
import { getColorText, ColorTextType } from '../props/color-text';

// Replace camelCasing with title Case
const CASING_REGEX = /([A-Z])/g;

interface SwatchProps {
    readonly palette?: ColorPalette;
    readonly propName: keyof ColorPalette;
    readonly className: string;
    readonly colorTextType: ColorTextType;
}

function Swatch(props: SwatchProps) {
    const swatch = props.palette?.[props.propName];
    const swatchProps = getSwatchProps<HTMLButtonElement>(swatch);
    swatchProps.class = `swatch ${props.className}`;
    swatchProps.style['grid-area'] = props.className;

    let description = '';
    let text = '';
    if (swatch) {
        description = props.propName.replace(CASING_REGEX, ' $1')!;
        description = description[0].toUpperCase() + description.slice(1);

        text = getColorText(props.colorTextType, swatch.color);
    }

    return (
        <button {...swatchProps}>
            <span class="swatch-description">{description}</span>
            <span class="swatch-text">{text}</span>
        </button>
    );
}

export function MainPalette(props: { palette?: ColorPalette }) {
    const [colorTextType, setType] = useState<ColorTextType>('HEX');

    const swatches: ComponentChild[] = [];
    for (const [propName, className] of COLOR_CLASSES) {
        swatches.push(
            <Swatch
                palette={props.palette}
                key={propName}
                propName={propName}
                className={className}
                colorTextType={colorTextType}
            />,
        );
    }

    return (
        <div class="colors palette-colors">
            <header class="toolbar palette-color-controls">
                <select
                    class="color-display"
                    id="color-display"
                    value={colorTextType}
                    onChange={e =>
                        setType(e.currentTarget.value as ColorTextType)
                    }
                >
                    <option value="HEX">HEX</option>
                    <option value="RGB">RGB</option>
                    <option value="HSL">HSL</option>
                </select>
            </header>
            {swatches}
        </div>
    );
}
