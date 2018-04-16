{
  /**
   * Convert image to data uri
   * @param {string} url
   * @param {HTMLCanvasElement} canvas
   * @returns {Promise<string>}
   */
  window.getDataUri = function getDataUri(url, canvas = tempCanvas) {
    var image = new Image();

    const promise = new Promise(resolve => {
      image.onload = () => {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        canvas.getContext('2d').drawImage(image, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });

    image.src = url;
    return promise;
  };
}
