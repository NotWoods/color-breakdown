{
  const list = document.getElementById('grid-items');
  const itemTemplate = document.getElementById('grid-item-template');
  const fab = document.getElementById('image-file-input');

  const dbWorker = new Worker('js/db-worker/index.js');

  const actions = {
    PUT_HISTORY_ITEM({ id, imgSrc, colors }) {
      let item = document.getElementById(id);
      if (item) {
        updatePaletteData(item, imgSrc, colors);
      } else {
        list.appendChild(createPaletteData(id, imgSrc, colors));
      }
    },
    OPEN_ITEM(newViewerState) {
      viewerState = newViewerState;
      updateViewer();
      viewer.classList.add('is-open');
    },
  };

  dbWorker.addEventListener('message', e => {
    console.log(e.data.type, e.data.payload);
    if (actions[e.data.type]) actions[e.data.type](e.data.payload);
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

  /**
   * Instructs the program to load history items
   */
  window.loadHistory = function loadHistory() {
    dbWorker.postMessage({ type: 'LOAD_HISTORY' });
  };

  /**
   * Load an item into the palette view
   * @param {number} id
   * @returns {Promise<{ id:number, imgSrc: string, colors: ColorPalette }>}
   */
  window.loadItem = function loadItem(id) {
    const onresponse = waitFor(id, 'OPEN_ITEM');
    dbWorker.postMessage({
      type: 'LOAD_ITEM',
      payload: { id },
    });
    return onresponse;
  };

  /**
   * Save an item into the database
   * @param {number} id
   * @param {string} imgSrc
   * @param {ColorPalette} colors
   * @returns {Promise<{ id:number }>}
   */
  window.saveItem = function saveItem(id, imgSrc, colors) {
    const onresponse = waitFor(id, 'SAVE_ITEM_SUCCESS', 'SAVE_ITEM_FAILURE');
    dbWorker.postMessage({
      type: 'SAVE_ITEM',
      payload: { id, imgSrc, colors },
    });
    return onresponse;
  };

  /**
   * Delete an item from history
   * @param {number} id
   * @returns {Promise<{ id:number >}
   */
  window.deleteItem = function loadItem(id) {
    const onresponse = waitFor(id, 'DELETE_ITEM_SUCCESS');
    dbWorker.postMessage({
      type: 'DELETE_ITEM',
      payload: { id },
    });
    return onresponse;
  };
}
