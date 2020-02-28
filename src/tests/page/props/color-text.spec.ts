import { getColorText as renderColorText } from '../../../page/props/color-text';

describe('renderColorText', () => {
    test('should return hex colors as-is', () => {
        expect(
            renderColorText({ colorTextType: 'HEX', hexColor: '#000000' }),
        ).toBe('#000000');
        expect(
            renderColorText({ colorTextType: 'HEX', hexColor: '#FFFFFF' }),
        ).toBe('#FFFFFF');
        expect(
            renderColorText({ colorTextType: 'HEX', hexColor: '#123456' }),
        ).toBe('#123456');
        expect(
            renderColorText({ colorTextType: 'HEX', hexColor: '#ABCDEF' }),
        ).toBe('#ABCDEF');
    });

    test('should return rgb colors', () => {
        expect(
            renderColorText({ colorTextType: 'RGB', hexColor: '#000000' }),
        ).toBe('R0 G0 B0');
        expect(
            renderColorText({ colorTextType: 'RGB', hexColor: '#FFFFFF' }),
        ).toBe('R255 G255 B255');
        expect(
            renderColorText({ colorTextType: 'RGB', hexColor: '#123456' }),
        ).toBe('R18 G52 B86');
        expect(
            renderColorText({
                colorTextType: 'RGB',
                hexColor: '#ABCDEF',
            }),
        ).toBe('R171 G205 B239');
    });

    test('should return hsl colors', () => {
        expect(
            renderColorText({ colorTextType: 'HSL', hexColor: '#000000' }),
        ).toBe('H0 S0 L0');
        expect(
            renderColorText({
                colorTextType: 'HSL',
                hexColor: '#FFFFFF',
            }),
        ).toBe('H0 S0 L100');
        expect(
            renderColorText({
                colorTextType: 'HSL',
                hexColor: '#123456',
            }),
        ).toBe('H58 S65 L20');
        expect(
            renderColorText({
                colorTextType: 'HSL',
                hexColor: '#ABCDEF',
            }),
        ).toBe('H58 S68 L80');
    });
});
