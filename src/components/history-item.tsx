import { h } from 'preact';
import { ColorPalette } from '../color-interfaces';
import { HistorySwatch } from './swatch';
import { revokeObjectUrlOnLoad } from '../revoke-object-url';

interface HistoryItemProps {
    readonly id: number;
    readonly name: string;
    readonly imgSrc: string;
    readonly colors: ColorPalette;
}

export function HistoryItem(props: HistoryItemProps) {
    return (
        <li class="grid-item">
            <a href={`#i${props.id}`} id={`i${props.id}`}>
                <div class="grid-item-img-box">
                    <img
                        class="grid-item-img"
                        alt={props.name}
                        src={props.imgSrc}
                        width="144"
                        height="144"
                        onLoad={revokeObjectUrlOnLoad}
                    />
                </div>
                <div class="grid-colors vibrant">
                    <HistorySwatch
                        id="dark-vibrant"
                        displayColor={props.colors.darkVibrant?.color}
                    />
                    <HistorySwatch
                        id="dark-muted"
                        displayColor={props.colors.darkMuted?.color}
                    />
                    <HistorySwatch
                        id="vibrant"
                        displayColor={props.colors.vibrant?.color}
                    />
                    <HistorySwatch
                        id="muted"
                        displayColor={props.colors.muted?.color}
                    />
                    <HistorySwatch
                        id="light-vibrant"
                        displayColor={props.colors.lightVibrant?.color}
                    />
                    <HistorySwatch
                        id="light-muted"
                        displayColor={props.colors.lightMuted?.color}
                    />
                </div>
            </a>
        </li>
    );
}
