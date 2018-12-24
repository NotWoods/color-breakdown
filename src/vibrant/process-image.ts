import { ColorPalette, ColorSwatch } from '../color-interfaces';
import { PaletteEntry } from '../entry';
import { handleMessage } from '../page/handle-message';

const VibrantModule = import('node-vibrant');

/**
 * Generate a palette from the given image source.
 */
export async function dataFromImageUrl(url: string): Promise<PaletteEntry> {
    const { default: Vibrant } = await VibrantModule;
    const palette = await Vibrant.from(url)
        .useQuantizer(Vibrant.Quantizer.WebWorker)
        .getPalette();

    // This isn't exported directly by node-vibrant, so pull it out here.
    type Swatch = (typeof palette)['Muted'];
    function toSwatch(vibrantSwatch: Swatch): ColorSwatch {
        if (!vibrantSwatch) return null;
        return {
            color: vibrantSwatch.getHex(),
            textColor: vibrantSwatch.getBodyTextColor(),
        };
    }

    const timestamp = Date.now();
    const colors: ColorPalette = {
        vibrant: toSwatch(palette.Vibrant),
        darkVibrant: toSwatch(palette.DarkVibrant),
        lightVibrant: toSwatch(palette.LightVibrant),
        muted: toSwatch(palette.Muted),
        darkMuted: toSwatch(palette.DarkMuted),
        lightMuted: toSwatch(palette.LightMuted),
    };

    return { timestamp, colors, imgSrc: url };
}

/**
 * Generate a palette from the given image source then save it and display it
 * on the screen.
 */
export async function processImage(url: string) {
    const payload = await dataFromImageUrl(url);
    // save data via database worker
    handleMessage({ type: 'DISPLAY', payload });
}
