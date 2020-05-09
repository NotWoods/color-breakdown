import { h } from 'preact';

interface HistorySwatchProps {
    /** name for css class */
    id: string;
    /** color displayed in the background of the grid */
    displayColor?: string;
    /** text color as either dark or light depending on background*/
    textColor?: string;
}

interface ViewerSwatchProps extends HistorySwatchProps {
    /** text to show what swatch is */
    children: string;
}

function swatchProps(props: HistorySwatchProps) {
    return {
        class: `swatch ${props.id}`,
        hidden: props.displayColor == null,
        style: {
            'background-color': props.displayColor!,
            color: props.textColor!,
        },
    };
}

export function ViewerSwatch(props: ViewerSwatchProps) {
    return (
        <button {...swatchProps(props)}>
            <span class="swatch-description">{props.children}</span>
            <span class="swatch-text">{props.displayColor}</span>
        </button>
    );
}

export function HistorySwatch(props: HistorySwatchProps) {
    return <span {...swatchProps(props)} />;
}
