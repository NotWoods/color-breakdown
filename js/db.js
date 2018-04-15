const list = document.getElementById('grid-items');
const itemTemplate = document.getElementById('grid-item-template');
const viewer = document.getElementById('palette');

const dbWorker = new Worker('js/db-worker.js');

dbWorker.addEventListener('message', e => {
  const { type, payload } = e.data;
  console.log(e.data);
  switch (type) {
    case 'PUT_HISTORY_ITEM': {
      let item = document.getElementById(payload.id);
      if (item) {
        updatePaletteData(item, payload.imgSrc, payload.colors);
      } else {
        const fragment = document.importNode(itemTemplate.content, true);
        item = fragment.querySelector('li');

        updatePaletteData(item, payload.imgSrc, payload.colors);
        item.id = payload.id;
        list.appendChild(item);
      }
      return;
    }
    case 'OPEN_ITEM':
      updatePaletteData(viewer, payload.imgSrc, payload.colors);
      return;
  }
});

function waitFor(id, successType, failureType) {
  return new Promise((resolve, reject) => {
    function listener(e) {
      const { type, payload } = e.data;
      if (type === successType) {
        if (payload.id === id) {
          resolve(payload);
          dbWorker.removeEventListener('message', listener);
        }
      } else if (type === failureType) {
        if (payload.id === id) {
          reject(payload);
          dbWorker.removeEventListener('message', listener);
        }
      }
    }

    dbWorker.addEventListener('message', listener);
  });
}

function loadHistory() {
  dbWorker.postMessage({ type: 'LOAD_HISTORY' });
}

function loadItem(id) {
  const onresponse = waitFor(id, 'OPEN_ITEM');
  dbWorker.postMessage({
    type: 'LOAD_ITEM',
    payload: { id }
  });
  return onresponse;
}

function saveItem(id, imgSrc, colors) {
  const onresponse = waitFor(id, 'SAVE_ITEM_SUCCESS', 'SAVE_ITEM_FAILURE');
  dbWorker.postMessage({
    type: 'SAVE_ITEM',
    payload: { id, imgSrc, colors }
  });
  return onresponse;
}
