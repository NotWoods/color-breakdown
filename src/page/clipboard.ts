declare global {
    interface Navigator {
        clipboard: Clipboard;
    }

    interface Clipboard {
        writeText(newClipText: string): Promise<void>;
    }
}

const ClipboardModule = navigator.clipboard || import('./clipboard-polyfill');

/**
 * Copies the color text displayed in a swatch.
 * @throws If user denies copy permission or copying fails
 */
export async function copySwatchText(event: Event) {
    const btn = (event.target as Element).closest('button.swatch');
    const span = btn != null ? btn.querySelector('.swatch-text') : null;
    const textContent = span != null ? span.textContent : null;

    if (textContent) {
        const { writeText } = await ClipboardModule;
        await writeText(textContent);
    }
}
