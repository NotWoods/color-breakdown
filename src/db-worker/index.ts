import { handleMessage } from './handle-message';

const postMessage = ((self as any) as DedicatedWorkerGlobalScope).postMessage;

self.addEventListener('message', evt => handleMessage(evt.data, postMessage));
handleMessage({ type: 'LOAD', payload: null }, postMessage);
