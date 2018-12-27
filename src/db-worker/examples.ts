import { PaletteEntry } from '../entry';

const white = '#FFFFFF';
const black = '#FFFFFF';

const example1: PaletteEntry = {
    timestamp: 1,
    imgSrc: 'img/demo/andrew-hughes-261571-unsplash.jpg',
    colors: {
        vibrant: { color: '#AE340E', textColor: white },
        darkVibrant: { color: '#6C140C', textColor: white },
        lightVibrant: { color: '#DACC9B', textColor: black },
        muted: { color: '#9F805F', textColor: white },
        darkMuted: { color: '#3B3945', textColor: white },
        lightMuted: { color: '#DAD3B0', textColor: black },
    },
};

const example2: PaletteEntry = {
    timestamp: 2,
    imgSrc: 'img/demo/ever-wild-634729-unsplash.jpg',
    colors: {
        vibrant: { color: '#FBA409', textColor: black },
        darkVibrant: { color: '#7C0404', textColor: white },
        lightVibrant: { color: '#F9A250', textColor: black },
        muted: { color: '#AC784C', textColor: white },
        darkMuted: { color: '#8C6C44', textColor: white },
        lightMuted: { color: '#BC987A', textColor: black },
    },
};

const example3: PaletteEntry = {
    timestamp: 3,
    imgSrc: 'img/demo/will-turner-1244879-unsplash.jpg',
    colors: {
        vibrant: { color: '#1E8EE0', textColor: white },
        darkVibrant: { color: '#061C2C', textColor: white },
        lightVibrant: { color: '#8AC4EF', textColor: black },
        muted: { color: '#777C80', textColor: white },
        darkMuted: { color: '#253D4C', textColor: white },
        lightMuted: { color: '#BBBCC4', textColor: black },
    },
};

export const examples: { [id: number]: PaletteEntry } = {
    1: example1,
    2: example2,
    3: example3,
};
