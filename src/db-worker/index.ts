import { handleMessage } from './handle-message';

export declare var self: DedicatedWorkerGlobalScope;

self.addEventListener('message', evt => handleMessage(evt.data, postMessage));
handleMessage({ type: 'LOAD', payload: undefined }, postMessage);
