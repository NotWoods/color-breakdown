{
  const form = document.getElementById('new-palette-entry');
  const canvas = document.createElement('canvas');

  loadHistory();
  loadFromHash();

  async function processFiles(files) {
    if (files.length > 0) {
      const url = processImageFiles(files);
      const uri = await getDataUri(url, canvas);
      await processUrl(uri);
      viewer.classList.add('is-open');
    }
  }

  async function loadFromHash() {
    const id = getId(location.hash.substr(1));
    if (id != null) {
      await loadItem(id);
    } else {
      viewer.classList.remove('is-open');
    }
  }

  colorDisplay.addEventListener('change', updateViewer);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    processFiles(form.imagefile.files);
  });

  form.imagefile.addEventListener('change', async e =>
    processFiles(e.currentTarget.files)
  );

  // File input focus polyfill for Firefox
  form.imagefile.addEventListener('focus', e =>
    e.target.classList.add('focus')
  );
  form.imagefile.addEventListener('blur', e =>
    e.target.classList.remove('focus')
  );

  window.addEventListener('hashchange', loadFromHash);

  document.getElementById('delete').addEventListener('click', e => {
    const id = getId(location.hash.substring(1));
    deleteItem(id);
    updatePaletteData(viewer);
    viewer.classList.remove('is-open');
    document.getElementById(id).remove();
  });

  document.getElementById('back').addEventListener('click', e => {
    e.preventDefault();
    viewer.classList.remove('is-open');

    if (history.state) {
      history.back();
    } else {
      history.replaceState(false, undefined, '');
    }
  });

  async function copyOnSwatchClick(event) {
    const colorEl = event.currentTarget.querySelector('.swatch-text');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        const { textContent } = colorEl;
        await navigator.clipboard.writeText(textContent);
      } else {
        const range = document.createRange();
        range.selectNode(colorEl);
        window.getSelection().addRange(range);
        const successful = document.execCommand('copy');
        if (!successful) throw new Error('Copy failed');
      }
    } catch (error) {
      console.error(error);
    }
  }
  for (const button of document.querySelectorAll('button.swatch')) {
    button.addEventListener('click', copyOnSwatchClick);
  }
}
