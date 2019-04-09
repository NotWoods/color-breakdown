(global as any).history = { replaceState: jest.fn(), back: jest.fn() };
(navigator as any).clipboard = { writeText: jest.fn() };
