const deleteItemFromDB = jest.fn().mockReturnValue(Promise.resolve());
const loadItemFromDB = jest.fn().mockReturnValue(Promise.resolve({}));
const loadHistoryFromDB = jest.fn().mockReturnValue(Promise.resolve());
const saveItemsToDB = jest.fn().mockReturnValue(Promise.resolve([undefined]));
jest.mock('../../db-worker/db', () => ({
    deleteItemFromDB,
    loadItemFromDB,
    loadHistoryFromDB,
    saveItemsToDB,
}));

import { handleMessage } from '../../db-worker/handle-message';

describe('handleMessage', () => {
    test('should call saveItemsToDB', async () => {
        const postMessage = jest.fn();
        await handleMessage({ type: 'SAVE', payload: [] }, postMessage);
        expect(saveItemsToDB).not.toBeCalled();
        expect(postMessage).not.toBeCalled();

        await handleMessage(
            {
                type: 'SAVE',
                payload: [
                    {
                        timestamp: 0,
                        name: '',
                        imgSrc: 'https://example.com',
                        colors: {
                            vibrant: { color: '#000000', textColor: '#FFFFFF' },
                        },
                    },
                ],
            },
            postMessage,
        );
        expect(saveItemsToDB).toBeCalledWith([
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
        ]);
        expect(postMessage).toBeCalledWith({
            type: 'DISPLAY',
            payload: expect.any(Object),
        });
        expect(postMessage).toBeCalledWith({
            type: 'ADD',
            payload: expect.any(Array),
        });
    });

    test('should call loadHistoryFromDB', async () => {
        await handleMessage({ type: 'LOAD', payload: undefined }, jest.fn());
        expect(loadHistoryFromDB).toBeCalledWith(
            expect.any(Function),
            expect.any(Function),
        );
    });

    test('should call loadItemFromDB', async () => {
        const postMessage = jest.fn();
        await handleMessage(
            { type: 'OPEN', payload: { timestamp: 0, firstLoad: false } },
            postMessage,
        );
        expect(loadItemFromDB).toBeCalledWith(0);
        expect(postMessage).toBeCalledWith({
            type: 'DISPLAY',
            payload: { entry: {}, firstLoad: false, updateHash: false },
        });
    });

    test('should call deleteItemFromDB', async () => {
        const postMessage = jest.fn();
        await handleMessage(
            { type: 'DELETE', payload: { timestamp: NaN, current: false } },
            postMessage,
        );
        expect(deleteItemFromDB).not.toBeCalled();
        expect(postMessage).not.toBeCalled();

        await handleMessage(
            { type: 'DELETE', payload: { timestamp: 0, current: false } },
            postMessage,
        );
        expect(deleteItemFromDB).toBeCalledWith(0);
        expect(postMessage).toBeCalledWith({
            type: 'REMOVE',
            payload: [0],
        });
    });
});
