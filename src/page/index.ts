import { WorkerAction } from '../db-worker/handle-message';
import { revokeObjectUrlOnLoad } from '../revoke-object-url';
import { handleMessage } from './handle-message';
import { handleBackClick } from './main-palette';

const dbWorker = new Worker('js/db-worker/index.js');
function postMessage(action: WorkerAction) {
    dbWorker.postMessage(action);
}

postMessage({ type: 'LOAD', payload: null });
loadFromHash();
window.addEventListener('hashchange', loadFromHash);
function loadFromHash() {
    const timestamp = parseInt(location.hash.slice(1), 10);
    postMessage({ type: 'OPEN', payload: timestamp });
}

// Handle messages from DB worker
dbWorker.addEventListener('message', evt => handleMessage(evt.data));

// Revoke object URLs on the main palette image on load
document
    .querySelector<HTMLImageElement>('.palette-image')!
    .addEventListener('load', revokeObjectUrlOnLoad);

document.getElementById('grid-items')!.addEventListener('click', evt => {
    const link = (evt.target as Element).closest('a');
    if (link != null) {
        const timestamp = parseInt(link.id.slice(1), 10);
        postMessage({ type: 'OPEN', payload: timestamp });
    }
});
document.getElementById('back')!.addEventListener('click', handleBackClick);

document.getElementById('delete')!.addEventListener('click', evt => {
    const timestamp = parseInt(location.hash.slice(1), 10);
    postMessage({ type: 'DELETE', payload: timestamp });
});
