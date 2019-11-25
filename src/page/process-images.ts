import { ColorPalette, ColorSwatch } from '../color-interfaces';
import { PaletteEntry } from '../entry';

const VibrantModule = import('node-vibrant');

/**
 * Generate a palette from the given image source.
 */
export async function dataFromImageUrl({
    name,
    url,
}: {
    name: string;
    url: string;
}): Promise<PaletteEntry> {
    const { default: Vibrant } = await VibrantModule;
    const palette = await Vibrant.from(url).getPalette();

    // This isn't exported directly by node-vibrant, so pull it out here.
    type Swatch = typeof palette['Muted'];
    function toSwatch(vibrantSwatch: Swatch): ColorSwatch | undefined {
        if (!vibrantSwatch) return undefined;
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

    return { timestamp, colors, imgSrc: url, name };
}

/**
 * Generate a palette entry for each file in the FileList.
 * Filters the files to only include images, then creates an object URL for
 * each and uses node-vibrant to process them.
 */
export function paletteFromImages(files: FileList | null | undefined) {
    const imageUrls = Array.from(files || [])
        .filter(file => file.type.match(/^image\//) != undefined)
        .map(file => ({ name: file.name, url: URL.createObjectURL(file) }));

    return Promise.all(imageUrls.map(dataFromImageUrl));
}
