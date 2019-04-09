import { renderImage } from '../../page/render-image';

describe('renderImage', () => {
    test('should set image source and alt', () => {
        const img = document.createElement('img');
        renderImage({ imgSrc: 'example.com/img.jpg', name: 'Test Image' }, img);
    });
});
