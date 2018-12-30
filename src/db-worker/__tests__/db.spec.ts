const mockHistoryStore = Symbol('history');
const mockExampleStore = Symbol('example');

const mockDb: import('idb').DB = {
    name: 'history-store',
    version: 1,
    objectStoreNames: null as any,
    transaction: jest.fn().mockReturnValue(
        Promise.resolve({
            objectStore(name: string) {
                switch (name) {
                    case 'history':
                        return mockHistoryStore;
                    case 'example':
                        return mockExampleStore;
                    default:
                        throw new Error('Passed bad object store name');
                }
            },
            complete: Promise.resolve(),
        }),
    ),
    close: jest.fn(),
};
jest.mock('idb', () => ({
    open: jest.fn(async (name, version, upgradeCallback) => {
        expect(name).toBe('history-store');
        expect(version).toBe(2);

        const createObjectStore = jest.fn();
        upgradeCallback({ createObjectStore, oldVersion: 0 });
        expect(createObjectStore).toBeCalledWith('history', { keyPath: 'id' });
        expect(createObjectStore).toBeCalledWith('example', { keyPath: 'id' });

        createObjectStore.mockClear();
        upgradeCallback({ createObjectStore, oldVersion: 1 });
        expect(createObjectStore).not.toBeCalledWith('history', {
            keyPath: 'id',
        });
        expect(createObjectStore).toBeCalledWith('example', { keyPath: 'id' });

        return mockDb;
    }),
}));

URL.createObjectURL = jest.fn().mockReturnValue('');

import {
    processEntry,
    openHistory,
    openExample,
    openHistoryAndExample,
} from '../db';

test('openHistory', async () => {
    expect(await openHistory('readonly')).toEqual({
        store: mockHistoryStore,
        complete: expect.any(Promise),
    });
    expect(mockDb.transaction).toBeCalledWith('history', 'readonly');
});

test('openExample', async () => {
    expect(await openExample('readwrite')).toEqual({
        store: mockExampleStore,
        complete: expect.any(Promise),
    });
    expect(mockDb.transaction).toBeCalledWith('example', 'readwrite');
});

test('openHistoryAndExample', async () => {
    expect(await openHistoryAndExample('readwrite')).toEqual({
        history: mockHistoryStore,
        example: mockExampleStore,
        complete: expect.any(Promise),
    });
    expect(mockDb.transaction).toBeCalledWith(
        ['history', 'example'],
        'readwrite',
    );
});

describe('processEntry', () => {
    test('should return null', () => {
        expect(processEntry(null)).toBeNull();
    });

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
