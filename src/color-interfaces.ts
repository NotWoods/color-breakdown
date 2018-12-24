/** Represents  */
export interface ColorSwatch {
    /** main color, as a hex string */
    readonly color: string;
    /** text color, as a hex string */
    readonly textColor: string;
}

export interface ColorPalette {
    vibrant?: ColorSwatch | null;
    darkVibrant?: ColorSwatch | null;
    lightVibrant?: ColorSwatch | null;
    muted?: ColorSwatch | null;
    darkMuted?: ColorSwatch | null;
    lightMuted?: ColorSwatch | null;
}
