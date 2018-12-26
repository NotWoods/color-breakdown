import { WorkerAction } from '../db-worker/handle-message';
import { revokeObjectUrlOnLoad } from '../revoke-object-url';
import { copySwatchText } from './clipboard';
import { handleMessage } from './handle-message';
import { handleBackClick } from './main-palette';
import { paletteFromImages } from './process-images';

const dbWorker = new Worker('js/db-worker.js');
function postMessage(action: WorkerAction) {
    dbWorker.postMessage(action);
}

const form = document.getElementById('new-palette-entry') as HTMLFormElement;
const fileInput = form.elements.namedItem('imagefile') as HTMLInputElement;
async function saveImages() {
    const entries = await paletteFromImages(fileInput.files);
    postMessage({ type: 'SAVE', payload: entries });
}

// Handle change of hash (which opens a new image).
// Deals with manually setting URL and clicking on history links.
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

// Close palette when back is clicked
document.getElementById('back')!.addEventListener('click', handleBackClick);

// Delete current palette when delete is clicked
document.getElementById('delete')!.addEventListener('click', evt => {
    evt.preventDefault();
    const timestamp = parseInt(location.hash.slice(1), 10);
    postMessage({ type: 'DELETE', payload: { timestamp, current: true } });
});

// Copy the text of a swatch on click
document
    .querySelector('.palette-colors')!
    .addEventListener('click', copySwatchText);

// Save images when the add button is used.
form.addEventListener('submit', evt => {
    evt.preventDefault();
    saveImages();
});
fileInput.addEventListener('change', saveImages);

// File input focus polyfill for Firefox
fileInput.addEventListener('focus', () => fileInput.classList.add('focus'));
fileInput.addEventListener('blur', () => fileInput.classList.remove('focus'));
