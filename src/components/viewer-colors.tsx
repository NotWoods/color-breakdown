import { h } from 'preact';
import { useState } from 'preact/hooks';
import { ColorPalette } from '../color-interfaces';
import { Swatch } from './swatch';
import { renderColorText } from '../page/render-color-text';

interface ViewerColorsProps {
    colors?: ColorPalette;
}

type DisplayType = 'HEX' | 'RGB' | 'HSL';

export function ViewerColors(props: ViewerColorsProps) {
    const [displayType, setDisplayType] = useState<DisplayType>('HEX');

    function convert(hexColor?: string) {
        if (hexColor == undefined) return undefined;
        return renderColorText({
            colorTextType: displayType,
            hexColor,
        });
    }

    return (
        <div class="colors palette-colors">
            <header class="toolbar palette-color-controls">
                <select
                    class="color-display"
                    id="color-display"
                    value={displayType}
                    onChange={(event) =>
                        setDisplayType(event.currentTarget.value as DisplayType)
                    }
                >
                    <option value="HEX">HEX</option>
                    <option value="RGB">RGB</option>
                    <option value="HSL">HSL</option>
                </select>
            </header>
            <Swatch
                id="dark-vibrant"
                textColor={props.colors?.darkVibrant?.textColor}
                displayColor={convert(props.colors?.darkVibrant?.color)}
            >
                Dark Vibrant
            </Swatch>
            <Swatch
                id="dark-muted"
                textColor={props.colors?.darkMuted?.textColor}
                displayColor={convert(props.colors?.darkMuted?.color)}
            >
                Dark Muted
            </Swatch>
            <Swatch
                id="vibrant"
                textColor={props.colors?.vibrant?.textColor}
                displayColor={convert(props.colors?.vibrant?.color)}
            >
                Vibrant
            </Swatch>
            <Swatch
                id="muted"
                textColor={props.colors?.muted?.textColor}
                displayColor={convert(props.colors?.muted?.color)}
            >
                Muted
            </Swatch>
            <Swatch
                id="light-vibrant"
                textColor={props.colors?.lightVibrant?.textColor}
                displayColor={convert(props.colors?.lightVibrant?.color)}
            >
                Light Vibrant
            </Swatch>
            <Swatch
                id="light-muted"
                textColor={props.colors?.lightMuted?.textColor}
                displayColor={convert(props.colors?.lightMuted?.color)}
            >
                Light Muted
            </Swatch>
        </div>
    );
}
