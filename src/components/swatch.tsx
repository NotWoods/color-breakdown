import { h } from 'preact';

interface SwatchProps {
    /** name for css class */
    id: string;
    /** text to show what swatch is */
    children: string;
    /** text color as either dark or light depending on background*/
    textColor?: string;
    /** color displayed in the background of the grid */
    displayColor?: string;
}

export function Swatch(props: SwatchProps) {
    return (
        <button
            class={`swatch ${props.id}`}
            hidden={props.displayColor == null}
            style={
                props.displayColor && props.textColor
                    ? {
                          'background-color': props.displayColor,
                          color: props.textColor,
                      }
                    : undefined
            }
        >
            <span class="swatch-description">{props.children}</span>
            <span class="swatch-text">{props.displayColor}</span>
        </button>
    );
}
