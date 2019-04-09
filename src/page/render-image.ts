interface ImageProps {
    readonly imgSrc: string;
    readonly name: string;
}

/**
 * Renders an image for palette.
 */
export function renderImage(props: ImageProps, target: HTMLImageElement) {
    target.src = props.imgSrc;
    target.alt = props.name;
}
