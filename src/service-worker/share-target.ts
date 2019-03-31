export declare var self: ServiceWorkerGlobalScope;

export function serveShareTarget(event: FetchEvent): void {
    const dataPromise = event.request.formData();

    // Redirect so the user can refresh the page without resending data.
    // @ts-ignore It doesn't like me giving a response to respondWith, although it's allowed.
    event.respondWith(Response.redirect('/?share-target'));

    event.waitUntil(
        (async function() {
            // The page sends this message to tell the service worker it's ready to receive the file.
            await new Promise(
                r => (new BroadcastChannel('share-ready').onmessage = r),
            );
            const client = await self.clients.get(event.resultingClientId);
            const data = await dataPromise;
            const file = data.get('file');
            client.postMessage({ file, action: 'load-image' });
        })(),
    );
}
