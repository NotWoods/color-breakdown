import { createPalette } from '../mock-palette';

const ABCDEF = /(rgb\(171, 205, 239\)|#ABCDEF|#abcdef)/;
const black = /(rgb\(0, 0, 0\)|#000000)/;

describe('renderPalette', () => {
    test('should hide if no colors are given', () => {
        const palette = createPalette();

        palette.render({ colorTextType: 'HEX', colors: {} });
        palette.forEach(element => expect(element.hidden).toBe(true));

        palette.render({ colorTextType: undefined, colors: undefined });
        palette.forEach(element => expect(element.hidden).toBe(true));
    });

    test('should not render text if no text type is given', () => {
        const palette = createPalette();

        palette.render({
            colorTextType: undefined,
            colors: {
                vibrant: { color: '#ABCDEF', textColor: '#000000' },
            },
        });

        expect(palette.vibrant.hidden).toBe(false);
        expect(palette.vibrant.style.backgroundColor).toMatch(ABCDEF);
        expect(palette.vibrant.textContent).toBe('');
    });

    test('should return hex colors as-is', () => {
        const palette = createPalette({ text: true });

        palette.render({
            colorTextType: 'HEX',
            colors: { muted: { color: '#ABCDEF', textColor: '#000000' } },
        });

        expect(palette.muted.hidden).toBe(false);
        expect(palette.muted.style.backgroundColor).toMatch(ABCDEF);
        expect(palette.muted.style.color).toMatch(black);
        expect(palette.muted.querySelector('.swatch-text')!.textContent).toBe(
            '#ABCDEF',
        );
    });

    test('should return rgb colors', () => {
        const palette = createPalette({ text: true });

        palette.render({
            colorTextType: 'RGB',
            colors: {
                lightVibrant: { color: '#ABCDEF', textColor: '#000000' },
            },
        });

        expect(palette.lightVibrant.hidden).toBe(false);
        expect(palette.lightVibrant.style.backgroundColor).toMatch(ABCDEF);
        expect(palette.lightVibrant.style.color).toMatch(black);
        expect(
            palette.lightVibrant.querySelector('.swatch-text')!.textContent,
        ).toBe('R171 G205 B239');
    });

    test('should return hsl colors', () => {
        const palette = createPalette({ text: true });

        palette.render({
            colorTextType: 'HSL',
            colors: {
                darkMuted: { color: '#ABCDEF', textColor: '#000000' },
            },
        });

        expect(palette.darkMuted.hidden).toBe(false);
        expect(palette.darkMuted.style.backgroundColor).toMatch(ABCDEF);
        expect(palette.darkMuted.style.color).toMatch(black);
        expect(
            palette.darkMuted.querySelector('.swatch-text')!.textContent,
        ).toBe('H58 S68 L80');
    });
});
