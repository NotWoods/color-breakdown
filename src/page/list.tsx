import { h, render } from 'preact';
import { PaletteEntry } from '../entry';
import { HistoryList } from '../components/history-list';
import { EXAMPLES } from '../db-worker/examples';

const LIST_CONTAINER = document.querySelector('#grid-items-container')!;
const listItems = new Map<number, PaletteEntry>(EXAMPLES);

function renderList() {
    render(
        <HistoryList items={Array.from(listItems.values())} />,
        LIST_CONTAINER,
    );
}

export function addPalettesToList(props: {
    items: ReadonlyArray<PaletteEntry>;
}) {
    for (const item of props.items) {
        listItems.set(item.timestamp, item);
    }
    renderList();
}

export function deletePalettesFromList(props: {
    timestamps: ReadonlyArray<number>;
}) {
    for (const id of props.timestamps) {
        listItems.delete(id);
    }
    renderList();
}
