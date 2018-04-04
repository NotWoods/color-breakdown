const form = document.getElementById("new-palette-entry");

loadHistory();

form.addEventListener("submit", e => {
	e.preventDefault();
	if (form.imageurl.value) processUrl(form.imageurl.url);
	else if (form.imagefile.files.length > 0) processUrl(processImageFiles(form.imagefile.files))
})

form.imagefile.addEventListener("change", e => processUrl(processImageFiles(e.currentTarget.files)))

async function processUrl(url) {
	const palette = await Vibrant.from(url)
		.useQuantizer(Vibrant.Quantizer.WebWorker)
		.getPalette()

	const id = Date.now();
	const colors = {
		vibrant: toSwatch(palette.Vibrant),
		darkVibrant: toSwatch(palette.DarkVibrant),
		lightVibrant: toSwatch(palette.LightVibrant),
		muted: toSwatch(palette.Muted),
		darkMuted: toSwatch(palette.DarkMuted),
		lightMuted: toSwatch(palette.LightMuted),
	}
	console.log(colors);
	await saveItem(id, url, colors)
	await loadItem(id);
}

function toSwatch(vibrantSwatch) {
	if (!vibrantSwatch) return null;
	return {
		color: vibrantSwatch.getHex(),
		textColor: vibrantSwatch.getBodyTextColor(),
	}
}
