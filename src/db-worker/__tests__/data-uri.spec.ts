import { dataUriToBlob, blobToDataUri } from '../data-uri';

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

describe('blobToDataUri', () => {
    const dataUris = [
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
        'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
    ];
    let i = 1;
    for (const dataUri of dataUris) {
        test(`should convert data uri #${i} to blob and back`, async () => {
            const blob = dataUriToBlob(dataUri);
            expect(await blobToDataUri(blob)).toBe(dataUri);
        });
        i++;
    }
});
