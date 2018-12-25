import { dataUriToBlob } from '../data-uri';

describe('dataUriToBlob', () => {
    test('should convert data uri', () => {
        const blob = dataUriToBlob(
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
        );
        expect(blob.type).toBe('image/png');
        expect(blob.size).toBe(70);
    });

    test('should use correct mime type', () => {
        const blob = dataUriToBlob(
            'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
        );
        expect(blob.type).toBe('image/gif');
        expect(blob.size).toBe(43);
    });
});

describe('blobToDataUri', () => {});
