// @ts-ignore
navigator.clipboard = { writeText: jest.fn() };

import { copySwatchText } from '../clipboard';

const nextTick = () => new Promise(resolve => process.nextTick(resolve));

describe('copySwatchText', () => {
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

    test('should copy text from swatch', async () => {
        const swatch = mockButton('#ABCDEF');
        swatch.dispatchEvent(new Event('click'));
        await nextTick();
        expect(navigator.clipboard.writeText).toBeCalledWith('#ABCDEF');
    });
});
