import { PaletteEntry } from '../entry';
import { h, render, Fragment } from 'preact';
import { GridItem } from './components/grid-item';

const LIST_ELEMENT = document.querySelector('#grid-items')!;

export class List {
    private items = new Map<number, PaletteEntry>();

    constructor(private element = LIST_ELEMENT) {}

    addPalettes(items: readonly PaletteEntry[]) {
        // First time, clear out the static render for preact
        if (this.items.size === 0) {
            while (this.element.firstChild) {
                this.element.removeChild(this.element.firstChild);
            }
        }

        for (const item of items) {
            this.items.set(item.timestamp, item);
        }
        this.reRender();
    }

    deletePalettes(timestamps: readonly number[]) {
        for (const timestamp of timestamps) {
            this.items.delete(timestamp);
        }
        this.reRender();
    }

    reRender() {
        render(
            <Fragment>
                {Array.from(this.items.values(), item => (
                    <GridItem key={item.timestamp} {...item} />
                ))}
            </Fragment>,
            this.element,
        );
    }
}
