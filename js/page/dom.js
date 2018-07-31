/**
 * @typedef {object} ColorSwatch
 * @prop {string} color - main color, as a hex string
 * @prop {string} textColor - text color, as a hex string
 */

/**
 * @typedef {object} ColorPalette
 * @prop {ColorSwatch | null} [vibrant]
 * @prop {ColorSwatch | null} [darkVibrant]
 * @prop {ColorSwatch | null} [lightVibrant]
 * @prop {ColorSwatch | null} [muted]
 * @prop {ColorSwatch | null} [darkMuted]
 * @prop {ColorSwatch | null} [lightMuted]
 */

const viewer = document.getElementById('palette');
const colorDisplay = document.getElementById('color-display');
let viewerState = {
  imgSrc: 'img/placeholder.svg',
  colors: {},
};
function getText(hex) {
  switch (colorDisplay.value) {
    case 'RGB':
    case 'HSL':
      const [r, g, b] = Vibrant.Util.hexToRgb(hex);
      if (colorDisplay.value === 'RGB') {
        return `R${r} G${g} B${b}`;
      }
      const [h, s, l] = Vibrant.Util.rgbToHsl(r, g, b).map(n =>
        Math.round(n * 100)
      );
      return `H${h} S${s} L${l}`;
    case 'HEX':
    default:
      return hex;
  }
}
function updateViewer() {
  updatePaletteData(viewer, viewerState.imgSrc, viewerState.colors, getText);
}

{
  const largeScreen = matchMedia('(min-width: 700px)');

  /**
   * Returns the ID from the currently open hash, or null if a
   * palette is not currently open.
   * @param {string} source
   * @returns {number | null}
   */
  window.getId = function getId(source) {
    const id = parseInt(source, 10);
    return Number.isNaN(id) ? null : id;
  };

  /**
   * @param {HTMLElement} node
   * @param {string} name
   * @param {ColorSwatch | null} data
   */
  window.setSwatchProperty = function setSwatchProperty(node, name, data) {
    if (data) {
      node.style.setProperty(`--${name}`, data.color);
      node.style.setProperty(`--${name}-text`, data.textColor);
    } else {
      node.style.removeProperty(`--${name}`);
      node.style.removeProperty(`--${name}-text`);
    }
  };

  /**
   * Update a swatch element
   * @param {HTMLElement} parent
   * @param {string} name
   * @param {ColorSwatch | null} data
   * @param {(color: string) => string} [getText]
   */
  function updateSwatch(parent, name, data, getText) {
    /** @type {HTMLElement} */
    const swatch = parent.querySelector(`.swatch.${name}`);

    swatch.hidden = data == null;

    setSwatchProperty(parent, name, data);

    if (getText) {
      const text = swatch.querySelector('.swatch-text');
      text.textContent = data != null ? getText(data.color) : '\u200b';
    }
  }

  async function onPaletteDataClick(e) {
    e.preventDefault();
    const id = getId(e.currentTarget.id);
    await loadItem(id);

    if (largeScreen.matches) {
      history.replaceState(true, undefined, `#${id}`);
    } else {
      history.pushState(true, undefined, `#${id}`);
    }
  }

  /**
   * Update a palette descriptor - either a grid item, or the palette page
   * @param {HTMLElement} node element to update
   * @param {string} imgSrc image source url
   * @param {ColorPalette} colors object with colors to use
   * @param {(color: string) => string} getText
   */
  window.updatePaletteData = function updatePaletteData(
    node,
    imgSrc = 'img/placeholder.svg',
    colors = {},
    getText = undefined
  ) {
    /** @type {HTMLImageElement} */
    const preview = node.querySelector('img.preview');
    preview.src = imgSrc;
    updateSwatch(node, 'vibrant', colors.vibrant, getText);
    updateSwatch(node, 'dark-vibrant', colors.darkVibrant, getText);
    updateSwatch(node, 'light-vibrant', colors.lightVibrant, getText);
    updateSwatch(node, 'muted', colors.muted, getText);
    updateSwatch(node, 'dark-muted', colors.darkMuted, getText);
    updateSwatch(node, 'light-muted', colors.lightMuted, getText);
  };

  const itemTemplate = document.getElementById('grid-item-template');
  window.createPaletteData = function createPaletteData(id, imgSrc, colors) {
    const fragment = document.importNode(itemTemplate.content, true);
    item = fragment.querySelector('li');

    updatePaletteData(item, imgSrc, colors);
    item.id = id;
    item.addEventListener('click', onPaletteDataClick);

    const link = fragment.querySelector('a');
    link.href = `#${id}`;

    return item;
  };

  /**
   * Get an image source from a FileList
   * @param {FileList} files
   * @returns {string} used as `<img src="return value">`
   */
  window.processImageFiles = function processImageFiles(files) {
    const file = Array.from(files).find(
      file => file.type.match(/^image\//) != null
    );
    if (file !== null) {
      return URL.createObjectURL(file);
    } else {
      return '';
    }
  };

  /**
   * Generate a palette from the given image source.
   * Afterwards, load the palette into view and save it to history.
   * @param {string} url
   */
  window.processUrl = async function processUrl(url) {
    function toSwatch(vibrantSwatch) {
      if (!vibrantSwatch) return null;
      return {
        color: vibrantSwatch.getHex(),
        textColor: vibrantSwatch.getBodyTextColor(),
      };
    }

    const palette = await Vibrant.from(url)
      .useQuantizer(Vibrant.Quantizer.WebWorker)
      .getPalette();

    const id = Date.now();
    const colors = {
      vibrant: toSwatch(palette.Vibrant),
      darkVibrant: toSwatch(palette.DarkVibrant),
      lightVibrant: toSwatch(palette.LightVibrant),
      muted: toSwatch(palette.Muted),
      darkMuted: toSwatch(palette.DarkMuted),
      lightMuted: toSwatch(palette.LightMuted),
    };

    const saveComplete = saveItem(id, url, colors);
    viewerState.imgSrc = url;
    viewerState.colors = colors;
    updateViewer();
    await saveComplete;
    history.replaceState(undefined, undefined, `#${id}`);
  };
}
