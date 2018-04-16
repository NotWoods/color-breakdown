{
  const form = document.getElementById('new-palette-entry');
  const canvas = document.createElement('canvas');
  const viewer = document.getElementById('palette');

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
    if (id != null) await loadItem(id);
  }

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
    history.replaceState(undefined, undefined, '');
    viewer.classList.remove('is-open');
  });
}
