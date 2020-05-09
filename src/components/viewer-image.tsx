import { h } from 'preact';
import { revokeIfObjectUrl } from '../revoke-object-url';

interface ViewerImageProps {
    readonly name?: string;
    readonly imgSrc?: string;
}

export function ViewerImage(props: ViewerImageProps) {
    return (
        <img
            class="palette-image"
            alt={props.imgSrc != undefined ? props.name : 'No image'}
            src={props.imgSrc ?? 'img/placeholder.svg'}
            onLoad={(event) => revokeIfObjectUrl(event.currentTarget.src)}
        />
    );
}
