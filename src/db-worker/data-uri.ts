/**
 * Convert Data URI representing an image into a blob with the same data.
 * @see https://stackoverflow.com/questions/12168909/blob-from-dataurl
 */
export function dataUriToBlob(dataUri: string) {
    const [header, data] = dataUri.split(',', 2);

    // separate out the mime component
    const mimeType = header.split(':', 2)[1].split(';', 1)[0];
    // convert base64 to raw binary data held in a string
    const byteString = atob(data);

    // write the bytes of the string to an ArrayBuffer
    const buffer = new ArrayBuffer(byteString.length);
    const intBuffer = new Uint8Array(buffer); // create a view into the buffer
    for (let i = 0; i < byteString.length; i++) {
        intBuffer[i] = byteString.charCodeAt(i);
    }

    return new Blob([buffer], { type: mimeType });
}

/**
 * Convert blob to data uri
 * @throws DOMException if error when reading
 */
export function blobToDataUri(blob: Blob) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
}
