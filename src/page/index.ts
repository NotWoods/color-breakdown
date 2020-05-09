import { WorkerAction } from '../db-worker/handle-message';
import { handleMessage } from './handle-message';
import { paletteFromImages } from './process-images';

const PASSIVE: AddEventListenerOptions = { passive: true };
const HASH_PREFIX = '#i';

const dbWorker = new Worker('js/db-worker.js');
function postMessage(action: WorkerAction) {
    dbWorker.postMessage(action);
}

function getOpenItem() {
    if (location.hash.startsWith(HASH_PREFIX)) {
        return parseInt(location.hash.slice(HASH_PREFIX.length), 10);
    } else {
        return undefined;
    }
}

const form = document.querySelector<HTMLFormElement>('#new-palette-entry')!;
const fileInput = form.elements.namedItem('imagefile') as HTMLInputElement;
async function saveImages() {
    const entries = await paletteFromImages(fileInput.files);
    postMessage({ type: 'SAVE', payload: entries });
}

// Handle change of hash (which opens a new image).
// Deals with manually setting URL and clicking on history links.
loadFromHash(true);
window.addEventListener('hashchange', () => loadFromHash(false));
function loadFromHash(firstLoad: boolean) {
    const timestamp = getOpenItem();
    console.log(timestamp);
    if (timestamp != undefined) {
        postMessage({ type: 'OPEN', payload: { timestamp, firstLoad } });
    } else {
        handleMessage(
            { type: 'DISPLAY', payload: { firstLoad: false } },
            postMessage,
        );
    }
}

// Handle messages from DB worker
dbWorker.addEventListener('message', (evt) =>
    handleMessage(evt.data, postMessage),
);

// Save images when the add button is used.
form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    saveImages();
});
fileInput.addEventListener('change', saveImages, PASSIVE);

// File input focus polyfill for Firefox
fileInput.addEventListener(
    'focus',
    () => fileInput.classList.add('focus'),
    PASSIVE,
);
fileInput.addEventListener(
    'blur',
    () => fileInput.classList.remove('focus'),
    PASSIVE,
);

import('insights-js').then((insights) => {
    insights.init('BRUajm5Rl0FGGGhk');
    insights.trackPages();
});
