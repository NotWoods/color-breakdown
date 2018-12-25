import { copySwatchText } from '../clipboard';

navigator.clipboard = { writeText: jest.fn() };

describe.skip('copySwatchText', () => {
    beforeEach(() => (navigator.clipboard.writeText as jest.Mock).mockClear());

    function mockButton(textContent: string) {
        const swatch = Object.assign(document.createElement('button'), {
            className: 'swatch',
        });
        swatch.appendChild(
            Object.assign(document.createElement('span'), {
                textContent,
                className: 'swatch-text',
            }),
        );
        swatch.addEventListener('click', copySwatchText);
        return swatch;
    }

    test('should copy text from swatch', () => {
        const swatch = mockButton('#ABCDEF');
        swatch.dispatchEvent(new Event('click'));
        expect(navigator.clipboard.writeText).toBeCalledWith('#ABCDEF');
    });

    test('should copy text from swatch if text clicked', () => {
        const swatch = mockButton('#ABCDEF');
        swatch.querySelector('.swatch-text')!.dispatchEvent(new Event('click'));
        expect(navigator.clipboard.writeText).toBeCalledWith('#ABCDEF');
    });
});
