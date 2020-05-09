import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { WorkerAction } from '../db-worker/handle-message';
import { PaletteEntry } from '../entry';
import { ViewerColors } from './viewer-colors';
import { ViewerImage } from './viewer-image';
import { ViewerToolbar } from './viewer-toolbar';

const TITLE = 'Color Breakdown';

export interface ViewerProps {
    /** Data to display on the main palette */
    readonly data?: PaletteEntry;
    /**
     * True if this image was loaded when the document loaded.
     * Changes back button behavior so that it doesn't navigate away
     * from the page accidentally.
     */
    readonly firstLoad: boolean;

    postMessage: (action: WorkerAction) => void;
}

export function Viewer(props: ViewerProps) {
    // Change the title and URL
    useEffect(() => {
        const title =
            props.data != undefined ? `${props.data.name} | ${TITLE}` : TITLE;
        const hash = props.data != undefined ? `#i${props.data.timestamp}` : '';

        document.title = title;
        if (hash !== location.hash) {
            history.replaceState(undefined, title, hash || '.');
        }
    });

    function handleBackClick() {
        if (!props.firstLoad) {
            history.back();
        }
    }

    return (
        <article
            class={`app-screen ${props.data ? 'is-open' : ''}`}
            id="palette"
        >
            <ViewerToolbar
                openItem={props.data?.timestamp}
                postMessage={props.postMessage}
                onBackClicked={handleBackClick}
            />
            <ViewerImage name={props.data?.name} imgSrc={props.data?.imgSrc} />
            <ViewerColors colors={props.data?.colors} />
        </article>
    );
}
