import { processEntry } from '../db';

URL.createObjectURL = jest.fn().mockReturnValue('');

describe('processEntry', () => {
    test('should return object with object url', () => {
        expect(
            processEntry({
                id: 100,
                colors: {
                    vibrant: { color: '#FFFFFF', textColor: '#000000' },
                },
                imgSrc:
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
            }),
        ).toMatchObject({
            timestamp: 100,
            colors: {
                vibrant: { color: '#FFFFFF', textColor: '#000000' },
            },
            imgSrc: expect.stringContaining(''),
        });
    });
});
