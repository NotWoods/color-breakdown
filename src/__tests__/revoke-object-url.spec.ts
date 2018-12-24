import { revokeIfObjectUrl, revokeObjectUrlOnLoad } from '../revoke-object-url';

URL.revokeObjectURL = jest.fn();

describe('revokeIfObjectUrl', () => {
    beforeEach(() => {
        (URL.revokeObjectURL as jest.Mock).mockClear();
    });

    test('should not revoke normal HTTP URL', () => {
        revokeIfObjectUrl('http://example.com/img.jpg');
        expect(URL.revokeObjectURL).not.toBeCalled();
    });

    test('should not revoke normal HTTPS URL', () => {
        revokeIfObjectUrl('https://example.com/img.jpg');
        expect(URL.revokeObjectURL).not.toBeCalled();
    });

    test('should not revoke normal data URI', () => {
        revokeIfObjectUrl(
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
        );
        expect(URL.revokeObjectURL).not.toBeCalled();
    });

    test('should revoke blob URL', () => {
        const url =
            'blob:https://example.com/b821a321-f28f-43c2-906e-bc7095b68421';
        revokeIfObjectUrl(url);

        expect(URL.revokeObjectURL).toBeCalledWith(url);
    });
});

describe('revokeObjectUrlOnLoad', () => {
    function mockImg(src: string) {
        const img = document.createElement('img');
        img.src = src;
        img.onload = revokeObjectUrlOnLoad;
        img.dispatchEvent(new UIEvent('load'));
        return img;
    }

    beforeEach(() => {
        (URL.revokeObjectURL as jest.Mock).mockClear();
    });

    test('should not revoke normal HTTP URL', () => {
        mockImg('http://example.com/img.jpg');
        expect(URL.revokeObjectURL).not.toBeCalled();
    });

    test('should not revoke normal HTTPS URL', () => {
        mockImg('https://example.com/img.jpg');
        expect(URL.revokeObjectURL).not.toBeCalled();
    });

    test('should not revoke normal data URI', () => {
        mockImg(
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
        );
        expect(URL.revokeObjectURL).not.toBeCalled();
    });

    test('should revoke blob URL', () => {
        const url =
            'blob:https://example.com/b821a321-f28f-43c2-906e-bc7095b68421';
        mockImg(url);

        expect(URL.revokeObjectURL).toBeCalledWith(url);
    });
});
