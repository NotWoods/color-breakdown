const addPalettesToList = jest.fn();
const deletePalettesFromList = jest.fn();
const displayMainPalette = jest.fn();
jest.mock('../list', () => ({ addPalettesToList, deletePalettesFromList }));
jest.mock('../main-palette', () => ({ displayMainPalette }));

import { handleMessage } from '../handle-message';

describe('handleMessage', () => {
    test('should call addPalettesToList', () => {
        handleMessage({ type: 'ADD', payload: [] });
        expect(addPalettesToList).toBeCalledWith({ items: [] });

        handleMessage({
            type: 'ADD',
            payload: [
                {
                    timestamp: 0,
                    imgSrc: 'https://example.com',
                    colors: {
                        vibrant: { color: '#000000', textColor: '#FFFFFF' },
                    },
                },
            ],
        });
        expect(addPalettesToList).toBeCalledWith({
            items: [
                {
                    timestamp: 0,
                    imgSrc: 'https://example.com',
                    colors: {
                        vibrant: { color: '#000000', textColor: '#FFFFFF' },
                    },
                },
            ],
        });
    });

    test('should call deletePalettesFromList', () => {
        handleMessage({ type: 'REMOVE', payload: [] });
        expect(deletePalettesFromList).toBeCalledWith({
            timestamps: [],
        });

        handleMessage({
            type: 'REMOVE',
            payload: [0],
        });
        expect(deletePalettesFromList).toBeCalledWith({
            timestamps: [0],
        });
    });

    test('should call displayMainPalette', () => {
        handleMessage({
            type: 'DISPLAY',
            payload: {
                timestamp: 0,
                imgSrc: 'https://example.com',
                colors: {
                    vibrant: {
                        color: '#000000',
                        textColor: '#FFFFFF',
                    },
                },
            },
        });
        expect(displayMainPalette).toBeCalledWith({
            data: {
                timestamp: 0,
                imgSrc: 'https://example.com',
                colors: {
                    vibrant: {
                        color: '#000000',
                        textColor: '#FFFFFF',
                    },
                },
            },
        });
    });
});
