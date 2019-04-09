/** Represents  */
export interface ColorSwatch {
    /** main color, as a hex string */
    readonly color: string;
    /** text color, as a hex string */
    readonly textColor: string;
}

export interface ColorPalette {
    readonly vibrant?: ColorSwatch | null;
    readonly darkVibrant?: ColorSwatch | null;
    readonly lightVibrant?: ColorSwatch | null;
    readonly muted?: ColorSwatch | null;
    readonly darkMuted?: ColorSwatch | null;
    readonly lightMuted?: ColorSwatch | null;
}
