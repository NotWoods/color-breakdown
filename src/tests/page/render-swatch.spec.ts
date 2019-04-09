import { renderSwatch } from '../../page/render-swatch';

const ABCDEF = /(rgb\(171, 205, 239\)|#ABCDEF|#abcdef)/;
const black = /(rgb\(0, 0, 0\)|#000000)/;

describe('renderSwatch', () => {
    test('should hide if no color is given', () => {
        const element = document.createElement('div');
        renderSwatch({ colorTextType: 'HEX', color: null }, element);
        expect(element.hidden).toBe(true);
    });

    test('should hide swatch with no text if no color is given', () => {
        const element = document.createElement('div');
        renderSwatch({ colorTextType: null, color: null }, element);
        expect(element.hidden).toBe(true);
    });

    test('should not render text if no text type is given', () => {
        const element = document.createElement('div');

        renderSwatch(
            {
                colorTextType: null,
                color: { color: '#ABCDEF', textColor: '#000000' },
            },
            element,
        );

        expect(element.hidden).toBe(false);
        expect(element.style.backgroundColor).toMatch(ABCDEF);
        expect(element.textContent).toBe('');
    });

    test('should return hex colors as-is', () => {
        const element = document.createElement('div');
        element.appendChild(
            Object.assign(document.createElement('span'), {
                className: 'swatch-text',
            }),
        );

        renderSwatch(
            {
                colorTextType: 'HEX',
                color: { color: '#ABCDEF', textColor: '#000000' },
            },
            element,
        );

        expect(element.hidden).toBe(false);
        expect(element.style.backgroundColor).toMatch(ABCDEF);
        expect(element.style.color).toMatch(black);
        expect(element.querySelector('.swatch-text')!.textContent).toBe(
            '#ABCDEF',
        );
    });

    test('should return rgb colors', () => {
        const element = document.createElement('div');
        element.appendChild(
            Object.assign(document.createElement('span'), {
                className: 'swatch-text',
            }),
        );

        renderSwatch(
            {
                colorTextType: 'RGB',
                color: { color: '#ABCDEF', textColor: '#000000' },
            },
            element,
        );

        expect(element.hidden).toBe(false);
        expect(element.style.backgroundColor).toMatch(ABCDEF);
        expect(element.style.color).toMatch(black);
        expect(element.querySelector('.swatch-text')!.textContent).toBe(
            'R171 G205 B239',
        );
    });

    test('should return hsl colors', () => {
        const element = document.createElement('div');
        element.appendChild(
            Object.assign(document.createElement('span'), {
                className: 'swatch-text',
            }),
        );

        renderSwatch(
            {
                colorTextType: 'HSL',
                color: { color: '#ABCDEF', textColor: '#000000' },
            },
            element,
        );

        expect(element.hidden).toBe(false);
        expect(element.style.backgroundColor).toMatch(ABCDEF);
        expect(element.style.color).toMatch(black);
        expect(element.querySelector('.swatch-text')!.textContent).toBe(
            'H58 S68 L80',
        );
    });
});
