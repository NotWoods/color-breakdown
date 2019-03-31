/**
 * Set up the service worker and monitor changes
 */
export async function offliner() {
    await navigator.serviceWorker.register('sw.js');
    console.log('Service Worker Registered');
}

/**
 * Wait for a image shared via Share Target API
 */
export function getSharedImage() {
    return new Promise<File>(resolve => {
        function onmessage(event: MessageEvent) {
            if (event.data.action !== 'load-image') return;
            resolve(event.data.file);
            navigator.serviceWorker.removeEventListener('message', onmessage);
        }

        navigator.serviceWorker.addEventListener('message', onmessage);

        // This message is picked up by the service worker -
        // it's how it knows we're ready to receive the file.
        new BroadcastChannel('share-ready').postMessage('share-ready');
    });
}
