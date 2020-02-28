import { h, ComponentChild } from 'preact';
import { PaletteEntry } from '../../entry';
import { revokeObjectUrlOnLoad } from '../../revoke-object-url';
import { getSwatchProps } from '../props/swatch';
import { COLOR_CLASSES } from '../props/palette';

export function GridItem(props: PaletteEntry) {
    const swatches: ComponentChild[] = [];
    for (const [propName, className] of COLOR_CLASSES) {
        const swatchProps = getSwatchProps(props.colors[propName]);
        swatchProps.key = propName;
        swatchProps.class = `swatch ${className}`;

        swatches.push(<span {...swatchProps} />);
    }

    return (
        <li class="grid-item light-muted">
            <a href={`#i${props.timestamp}`} id={`i${props.timestamp}`}>
                <div class="grid-item-img-box">
                    <img
                        class="grid-item-img preview"
                        src={props.imgSrc}
                        alt={props.name}
                        height="144"
                        width="144"
                        onLoad={revokeObjectUrlOnLoad}
                    />
                </div>
                <div class="colors grid-colors vibrant">{swatches}</div>
            </a>
        </li>
    );
}
