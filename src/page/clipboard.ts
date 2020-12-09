declare var navigator: Navigator;

const ClipboardModule = navigator.clipboard || import('./clipboard-polyfill');

/**
 * Copies the color text displayed in a swatch.
 * @throws If user denies copy permission or copying fails
 */
export async function copySwatchText(event: Event) {
    const btn = (event.target as Element).closest('button.swatch');
    const span = btn && btn.querySelector('.swatch-text');
    const textContent = span && span.textContent;

    if (textContent) {
        const clipboard = await ClipboardModule;
        await clipboard.writeText(textContent);
    }
}
