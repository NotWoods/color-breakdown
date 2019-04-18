import { PaletteEntry } from '../entry';
import { revokeObjectUrlOnLoad } from '../revoke-object-url';
import { renderPalette } from './render-palette';
import { renderImage } from './render-image';

const LIST_ELEMENT = document.querySelector('#grid-items')!;
const LIST_ITEM_TEMPLATE = document.querySelector<HTMLTemplateElement>(
    '#grid-item-template',
)!;

export function addPalettesToList(props: {
    items: ReadonlyArray<PaletteEntry>;
}) {
    const fragment = document.createDocumentFragment();
    for (const child of props.items) {
        const template = document.importNode(LIST_ITEM_TEMPLATE.content, true);
        renderImage(
            child,
            template.querySelector<HTMLImageElement>('img.preview')!,
        );
        renderPalette({ ...child, colorTextType: undefined }, template);

        const link = template.querySelector('a')!;
        link.id = child.timestamp.toString();
        link.href = `#${child.timestamp}`;

        template
            .querySelector('img')!
            .addEventListener('load', revokeObjectUrlOnLoad);

        fragment.appendChild(template);
    }
    LIST_ELEMENT.appendChild(fragment);
}

export function deletePalettesFromList(props: {
    timestamps: ReadonlyArray<number>;
}) {
    props.timestamps.forEach(timestamp => {
        const link = document.querySelector(`#${timestamp}`);
        const li = link && link.parentElement;
        if (li) {
            LIST_ELEMENT.removeChild(li);
        }
    });
}
