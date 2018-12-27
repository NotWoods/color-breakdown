const deleteItemFromDB = jest.fn().mockReturnValue(Promise.resolve());
const loadItemFromDB = jest.fn().mockReturnValue(Promise.resolve({}));
const loadHistoryFromDB = jest.fn().mockReturnValue(Promise.resolve());
const hideExamples = jest.fn().mockReturnValue(Promise.resolve());
const saveItemsToDB = jest.fn().mockReturnValue(Promise.resolve([]));
jest.mock('../display', () => ({ deleteItemFromDB, loadItemFromDB }));
jest.mock('../history', () => ({
    hideExamples,
    loadHistoryFromDB,
    saveItemsToDB,
}));

import { handleMessage } from '../handle-message';

describe('handleMessage', () => {
    test.skip('should call saveItemsToDB', () => {
        const postMessage = jest.fn();
        handleMessage({ type: 'SAVE', payload: [] }, postMessage);
        expect(saveItemsToDB).not.toBeCalled();
        expect(postMessage).not.toBeCalled();

        handleMessage(
            {
                type: 'SAVE',
                payload: [
                    {
                        timestamp: 0,
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

    test('should call loadHistoryFromDB and hideExamples', () => {
        handleMessage({ type: 'LOAD', payload: null }, jest.fn());
        expect(loadHistoryFromDB).toBeCalledWith(expect.any(Function));
        expect(hideExamples).toBeCalledWith(expect.any(Function));
    });

    test.skip('should call loadItemFromDB', () => {
        const postMessage = jest.fn();
        handleMessage({ type: 'OPEN', payload: 0 }, postMessage);
        expect(loadItemFromDB).toBeCalledWith(0);
        expect(postMessage).toBeCalledWith({ type: 'DISPLAY', payload: {} });
    });

    test.skip('should call deleteItemFromDB', () => {
        const postMessage = jest.fn();
        handleMessage(
            { type: 'DELETE', payload: { timestamp: NaN, current: false } },
            postMessage,
        );
        expect(deleteItemFromDB).not.toBeCalled();
        expect(postMessage).not.toBeCalled();

        handleMessage(
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
