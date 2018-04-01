/**
 * @typedef {object} ColorSwatch
 * @prop {string} color - main color, as a hex string
 * @prop {string} textColor - text color, as a hex string
 */

/**
 * Update a palette descriptor - either a grid item, or the palette page
 * @param {HTMLElement} node element to update
 * @param {string} imgSrc image source url
 * @param {object} colors object with colors to use
 * @param {ColorSwatch | null} [colors.vibrant]
 * @param {ColorSwatch | null} [colors.darkVibrant]
 * @param {ColorSwatch | null} [colors.lightVibrant]
 * @param {ColorSwatch | null} [colors.muted]
 * @param {ColorSwatch | null} [colors.darkMuted]
 * @param {ColorSwatch | null} [colors.lightMuted]
 */
function updatePaletteData(node, imgSrc = "icons/placeholder.svg", colors = {}) {
	node.querySelector("img.preview").src = imgSrc;
	updateSwatch(node, "vibrant", colors.vibrant);
	updateSwatch(node, "dark-vibrant", colors.darkVibrant);
	updateSwatch(node, "light-vibrant", colors.lightVibrant);
	updateSwatch(node, "muted", colors.muted);
	updateSwatch(node, "dark-muted", colors.darkMuted);
	updateSwatch(node, "light-muted", colors.lightMuted);
}

/**
 * Update a swatch element
 * @param {HTMLElement} parent
 * @param {string} name
 * @param {ColorSwatch | null} data
 */
function updateSwatch(parent, name, data) {
	const swatch = parent.querySelector(`.swatch.${name}`);
	const text = swatch.querySelector("swatch-text");

	swatch.hidden = data == null;
	if (data) {
		parent.style.setProperty(`--${name}`, data.color);
		parent.style.setProperty(`--${name}-text`, data.textColor);
	} else {
		parent.style.removeProperty(`--${name}`);
		parent.style.removeProperty(`--${name}-text`);
	}

	if (text) {
		text.textContent = data != null ? data.color : "#??????"
	}
}
