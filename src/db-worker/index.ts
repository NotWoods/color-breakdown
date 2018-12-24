import { handleMessage } from './handle-message';

self.addEventListener('message', evt =>
    handleMessage(
        evt.data,
        ((self as any) as DedicatedWorkerGlobalScope).postMessage,
    ),
);
