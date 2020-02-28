import { ColorPalette } from '../../color-interfaces';

export const COLOR_CLASSES: ReadonlyMap<keyof ColorPalette, string> = new Map(
    Object.entries({
        vibrant: 'vibrant',
        darkVibrant: 'dark-vibrant',
        lightVibrant: 'light-vibrant',
        muted: 'muted',
        darkMuted: 'dark-muted',
        lightMuted: 'light-muted',
    }) as [keyof ColorPalette, string][],
);
