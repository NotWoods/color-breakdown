const addPalettesToList = jest.fn();
const deletePalettesFromList = jest.fn();
const displayMainPalette = jest.fn();
jest.mock('../../page/list', () => ({
    addPalettesToList,
    deletePalettesFromList,
}));
jest.mock('../../page/main-palette', () => ({ displayMainPalette }));

import { handleMessage } from '../../page/handle-message';

function postMessage() {}

describe('handleMessage', () => {
    test('should call addPalettesToList', () => {
        handleMessage({ type: 'ADD', payload: [] }, postMessage);
        expect(addPalettesToList).toBeCalledWith({ items: [] });

        handleMessage(
            {
                type: 'ADD',
                payload: [
                    {
                        timestamp: 0,
                        imgSrc: 'https://example.com',
                        name: '',
                        colors: {
                            vibrant: { color: '#000000', textColor: '#FFFFFF' },
                        },
                    },
                ],
            },
            postMessage,
        );
        expect(addPalettesToList).toBeCalledWith({
            items: [
                {
                    timestamp: 0,
                    imgSrc: 'https://example.com',
                    name: '',
                    colors: {
                        vibrant: {
                            color: '#000000',
                            textColor: '#FFFFFF',
                        },
                    },
                },
            ],
        });
    });

    test('should call deletePalettesFromList', () => {
        handleMessage({ type: 'REMOVE', payload: [] }, postMessage);
        expect(deletePalettesFromList).toBeCalledWith({
            timestamps: [],
        });

        handleMessage(
            {
                type: 'REMOVE',
                payload: [0],
            },
            postMessage,
        );
        expect(deletePalettesFromList).toBeCalledWith({
            timestamps: [0],
        });
    });

    test('should call displayMainPalette', () => {
        handleMessage(
            {
                type: 'DISPLAY',
                payload: {
                    entry: {
                        timestamp: 0,
                        name: '',
                        imgSrc: 'https://example.com',
                        colors: {
                            vibrant: {
                                color: '#000000',
                                textColor: '#FFFFFF',
                            },
                        },
                    },
                    firstLoad: false,
                },
            },
            postMessage,
        );
        expect(displayMainPalette).toBeCalledWith({
            data: {
                timestamp: 0,
                imgSrc: 'https://example.com',
                name: '',
                colors: {
                    vibrant: {
                        color: '#000000',
                        textColor: '#FFFFFF',
                    },
                },
            },
            firstLoad: false,
            updateHash: false,
        });
    });
});
