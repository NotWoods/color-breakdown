import { h } from 'preact';
import { WorkerAction } from '../db-worker/handle-message';

interface ViewerToolbarProps {
    /** ID of the current open item */
    openItem?: number;

    postMessage: (action: WorkerAction) => void;
    onBackClicked: () => void;
}

export function ViewerToolbar(props: ViewerToolbarProps) {
    // Delete current palette when delete is clicked
    function deletePalette() {
        const timestamp = props.openItem;

        if (timestamp != undefined) {
            props.postMessage({
                type: 'DELETE',
                payload: { timestamp, current: true },
            });
        }
    }

    return (
        <header class="toolbar transparent-toolbar">
            <button
                id="back"
                type="button"
                class="toolbar-button white-button back"
                onClick={props.onBackClicked}
            >
                <span class="btn-label left">Back</span>
                <svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
            </button>

            <h2 class="toolbar-title"></h2>
            <button
                id="delete"
                type="button"
                class="toolbar-button white-button"
                onClick={deletePalette}
            >
                <span class="btn-label">Delete</span>
                <svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
            </button>
        </header>
    );
}
