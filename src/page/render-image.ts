interface ImageProps {
    alt?: string;
    timestamp?: number;
    imgSrc: string;
}

/**
 * Renders an image for palette.
 */
export function renderImage(props: ImageProps, target: HTMLImageElement) {
    target.src = props.imgSrc;
    if (props.alt != null) {
        target.alt = props.alt;
    } else if (props.timestamp != null) {
        target.alt = new Date(props.timestamp).toLocaleString();
    } else {
        target.alt = '';
    }
}
