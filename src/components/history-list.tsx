import { h } from 'preact';
import { PaletteEntry } from '../entry';
import { HistoryItem } from './history-item';

interface HistoryListProps {
    readonly items: readonly PaletteEntry[];
}
export function HistoryList(props: HistoryListProps) {
    const listItems = props.items.map((item) => (
        <HistoryItem
            key={item.timestamp.toString()}
            id={item.timestamp}
            name={item.name}
            imgSrc={item.imgSrc}
            colors={item.colors}
        ></HistoryItem>
    ));

    return (
        <ul id="grid-items" class="grid-list">
            {listItems}
        </ul>
    );
}
