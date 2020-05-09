import { h } from 'preact';
import { useState } from 'preact/hooks';
import { ColorPalette } from '../color-interfaces';
import { ViewerSwatch } from './swatch';
import { renderColorText } from '../page/render-color-text';
import { copySwatchText } from '../page/clipboard';

interface ViewerColorsProps {
    readonly colors?: ColorPalette;
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
        <div class="colors palette-colors" onClick={copySwatchText}>
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
            <ViewerSwatch
                id="dark-vibrant"
                textColor={props.colors?.darkVibrant?.textColor}
                displayColor={convert(props.colors?.darkVibrant?.color)}
            >
                Dark Vibrant
            </ViewerSwatch>
            <ViewerSwatch
                id="dark-muted"
                textColor={props.colors?.darkMuted?.textColor}
                displayColor={convert(props.colors?.darkMuted?.color)}
            >
                Dark Muted
            </ViewerSwatch>
            <ViewerSwatch
                id="vibrant"
                textColor={props.colors?.vibrant?.textColor}
                displayColor={convert(props.colors?.vibrant?.color)}
            >
                Vibrant
            </ViewerSwatch>
            <ViewerSwatch
                id="muted"
                textColor={props.colors?.muted?.textColor}
                displayColor={convert(props.colors?.muted?.color)}
            >
                Muted
            </ViewerSwatch>
            <ViewerSwatch
                id="light-vibrant"
                textColor={props.colors?.lightVibrant?.textColor}
                displayColor={convert(props.colors?.lightVibrant?.color)}
            >
                Light Vibrant
            </ViewerSwatch>
            <ViewerSwatch
                id="light-muted"
                textColor={props.colors?.lightMuted?.textColor}
                displayColor={convert(props.colors?.lightMuted?.color)}
            >
                Light Muted
            </ViewerSwatch>
        </div>
    );
}
