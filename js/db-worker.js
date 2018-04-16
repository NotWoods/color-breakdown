importScripts('../node_modules/idb/lib/idb.js');

const dbPromise = idb.open('history-store', 1, upgradeDB => {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('history', { keyPath: 'id' });
    // fall through
  }
});

/**
 * Load the history list. Emits an event for each item.
 * @emits PUT_HISTORY_ITEM
 */
async function loadHistoryFromDB(callback) {
  const db = await dbPromise;
  const tx = db.transaction('history', 'readonly');

  tx.objectStore('history').iterateCursor(cursor => {
    if (!cursor) return;

    callback({
      id: cursor.key,
      imgSrc: cursor.value.imgSrc,
      colors: cursor.value.colors,
    });
    cursor.continue();
  });
  await tx.complete;
}

/**
 * Loads a single history item into the main palette viewer, by emitted an event
 * @emits OPEN_ITEM
 * @param {string} id
 */
async function loadItemFromDB(id) {
  const db = await dbPromise;
  const item = await db
    .transaction('history', 'readonly')
    .objectStore('history')
    .get(id);

  return {
    id,
    imgSrc: item.imgSrc,
    colors: item.colors,
  };
}

/**
 * Save an item to the database
 * @param {string} id
 * @param {string} imgSrc
 * @param {ColorPalette} colors
 */
async function saveItemToDB(id, imgSrc, colors) {
  const db = await dbPromise;
  const tx = db.transaction('history', 'readwrite');
  tx.objectStore('history').put({
    id,
    imgSrc,
    colors,
  });

  await tx.complete;
  return id;
}

const actions = {
  async SAVE_ITEM({ id, imgSrc, colors }) {
    await saveItemToDB(id, imgSrc, colors);
    self.postMessage({
      type: 'SAVE_ITEM_SUCCESS',
      payload: { id },
    });
    self.postMessage({
      type: 'PUT_HISTORY_ITEM',
      payload: { id, imgSrc, colors },
    });
  },
  async LOAD_HISTORY() {
    await loadHistoryFromDB(result =>
      self.postMessage({
        type: 'PUT_HISTORY_ITEM',
        payload: result,
      })
    );
  },
  async LOAD_ITEM({ id }) {
    const result = await loadItemFromDB(id);
    self.postMessage({
      type: 'OPEN_ITEM',
      payload: result,
    });
  },
};

self.addEventListener('message', e => {
  console.log(e.data);
  actions[e.data.type](e.data.payload);
});
