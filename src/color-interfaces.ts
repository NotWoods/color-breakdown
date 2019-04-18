/** Represents  */
export interface ColorSwatch {
    /** main color, as a hex string */
    readonly color: string;
    /** text color, as a hex string */
    readonly textColor: string;
}

export interface ColorPalette {
    readonly vibrant?: ColorSwatch;
    readonly darkVibrant?: ColorSwatch;
    readonly lightVibrant?: ColorSwatch;
    readonly muted?: ColorSwatch;
    readonly darkMuted?: ColorSwatch;
    readonly lightMuted?: ColorSwatch;
}
