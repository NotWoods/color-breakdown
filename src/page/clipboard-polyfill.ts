export function writeText(str: string) {
    return new Promise(function(resolve, reject) {
        let success = false;
        function listener(evt: ClipboardEvent) {
            evt.clipboardData.setData('text/plain', str);
            evt.preventDefault();
            success = true;
        }
        document.addEventListener('copy', listener);
        document.execCommand('copy');
        document.removeEventListener('copy', listener);
        success ? resolve() : reject();
    });
}
