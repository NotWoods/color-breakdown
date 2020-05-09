import { render, h } from 'preact';
import { Viewer, ViewerProps } from '../components/viewer';

const VIEWER_CONTAINER = document.querySelector('#palette-container')!;

export function displayMainPalette(props: ViewerProps) {
    render(<Viewer {...props} />, VIEWER_CONTAINER);
}
