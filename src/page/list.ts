import { PaletteEntry } from '../entry';
import { revokeObjectUrlOnLoad } from '../revoke-object-url';
import { renderPalette } from './render-palette';
import { renderImage } from './render-image';

interface AddPalettesProps {
    readonly items: PaletteEntry[];
}

const LIST_ELEMENT = document.getElementById('grid-items')!;
const LIST_ITEM_TEMPLATE = document.getElementById(
    'grid-item-template',
) as HTMLTemplateElement;

export function addPalettesToList(props: AddPalettesProps) {
    const fragment = document.createDocumentFragment();
    for (const child of props.items) {
        const template = document.importNode(LIST_ITEM_TEMPLATE.content, true);
        renderImage(
            child,
            template.querySelector<HTMLImageElement>('img.preview')!,
        );
        renderPalette({ ...child, colorTextType: null }, template);

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

interface RemovePalettesProps {
    readonly timestamps: number[];
}

export function deletePalettesFromList(props: RemovePalettesProps) {
    const openPaletteId = parseInt(location.hash.slice(1), 10);
    let wasPaletteClosed = false;
    for (const timestamp of props.timestamps) {
        if (timestamp === openPaletteId) {
            wasPaletteClosed = true;
        }
        const link = document.getElementById(timestamp.toString());
        const li = link != null ? link.parentElement : null;
        if (li != null) {
            LIST_ELEMENT.removeChild(li);
        }
    }

    // Open a different palette if the current one was deleted.
    // If no other palettes exist, just do nothing.
    if (wasPaletteClosed) {
        const otherLink = LIST_ELEMENT.querySelector('a');
        if (otherLink != null) {
            otherLink.click();
        }
    }
}
