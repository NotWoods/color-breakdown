type Vec3 = [number, number, number];
export type ColorTextType = 'HEX' | 'RGB' | 'HSL';

interface ColorTextProps {
    readonly colorTextType: ColorTextType;
    readonly hexColor: string;
}

// Helpers from Vibrant.Util
function hexToRgb(hex: string): Vec3 | undefined {
    let match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (match == undefined) return undefined;

    const vector = [match[1], match[2], match[3]].map(s => parseInt(s, 16));
    return vector as Vec3;
}
function rgbToHsl(r: number, g: number, b: number): Vec3 {
    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h: number;
    let s: number;
    let l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
            default:
                throw new Error();
        }

        h /= 6;
    }
    return [h, s, l];
}

/**
 * Renders the text representing a color. Formats based on the given color
 * text type.
 */
export function getColorText(props: ColorTextProps) {
    switch (props.colorTextType) {
        case 'RGB':
        case 'HSL':
            const rgb = hexToRgb(props.hexColor);
            if (rgb == undefined) {
                return props.hexColor;
            }
            const [r, g, b] = rgb;
            if (props.colorTextType === 'RGB') {
                return `R${r} G${g} B${b}`;
            }
            const [h, s, l] = rgbToHsl(r, g, b).map(n => Math.round(n * 100));
            return `H${h} S${s} L${l}`;
        case 'HEX':
        default:
            return props.hexColor;
    }
}
