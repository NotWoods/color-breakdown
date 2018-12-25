interface ImageProps {
    timestamp: number;
    imgSrc: string;
}

/**
 * Renders an image for palette.
 */
export function renderImage(props: ImageProps, target: HTMLImageElement) {
    target.src = props.imgSrc;
    target.alt = new Date(props.timestamp).toLocaleString();
}
