export function writeText(str: string) {
    return new Promise((resolve, reject) => {
        let success = false;
        document.addEventListener(
            'copy',
            (evt: ClipboardEvent) => {
                evt.clipboardData!.setData('text/plain', str);
                evt.preventDefault();
                success = true;
            },
            { once: true },
        );
        document.execCommand('copy');
        success ? resolve() : reject();
    });
}
