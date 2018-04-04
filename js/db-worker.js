importScripts("../node_modules/idb/lib/idb.js");

const dbPromise = idb.open('history-store', 1, upgradeDB => {
	switch (upgradeDB.oldVersion) {
		case 0:
			upgradeDB.createObjectStore('history', { keyPath: "id" })
			// fall through
	}
})

/**
 * Load the history list. Emits an event for each item.
 * @emits PUT_HISTORY_ITEM
 */
async function loadHistoryFromDB() {
	const db = await dbPromise;
	const tx = db.transaction('history', 'readonly');

	tx.objectStore('history').iterateCursor(cursor => {
		if (!cursor) return;

		self.postMessage({
			type: "PUT_HISTORY_ITEM",
			payload: {
				id: cursor.key,
				imgSrc: cursor.value.imgSrc,
				colors: cursor.value.colors,
			},
		})
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

	self.postMessage({
		type: "OPEN_ITEM",
		payload: {
			id,
			imgSrc: item.imgSrc,
			colors: item.colors,
		},
	})
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
	self.postMessage({
		type: "SAVE_ITEM_SUCCESS",
		payload: { id },
	})
	return id;
}

self.addEventListener("message", (e) => {
	const { type, payload } = e.data;
	console.log(e.data);
	switch (type) {
		case "SAVE_ITEM":
			saveItemToDB(payload.id, payload.imgSrc, payload.colors);
			return;
		case "LOAD_HISTORY":
			loadHistoryFromDB();
			return;
		case "LOAD_ITEM":
			loadItemFromDB(payload.id);
			return;
	}
})
