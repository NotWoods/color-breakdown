import { renderColorText } from '../../page/render-color-text';

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
        ).toBe('rgb(0, 0, 0)');
        expect(
            renderColorText({ colorTextType: 'RGB', hexColor: '#FFFFFF' }),
        ).toBe('rgb(255, 255, 255)');
        expect(
            renderColorText({ colorTextType: 'RGB', hexColor: '#123456' }),
        ).toBe('rgb(18, 52, 86)');
        expect(
            renderColorText({
                colorTextType: 'RGB',
                hexColor: '#ABCDEF',
            }),
        ).toBe('rgb(171, 205, 239)');
    });

    test('should return hsl colors', () => {
        expect(
            renderColorText({ colorTextType: 'HSL', hexColor: '#000000' }),
        ).toBe('hsl(0, 0, 0)');
        expect(
            renderColorText({
                colorTextType: 'HSL',
                hexColor: '#FFFFFF',
            }),
        ).toBe('hsl(0, 0, 100)');
        expect(
            renderColorText({
                colorTextType: 'HSL',
                hexColor: '#123456',
            }),
        ).toBe('hsl(58, 65, 20)');
        expect(
            renderColorText({
                colorTextType: 'HSL',
                hexColor: '#ABCDEF',
            }),
        ).toBe('hsl(58, 68, 80)');
    });
});
