{
  const form = document.getElementById('new-palette-entry');
  const canvas = document.createElement('canvas');

  loadHistory();

  async function processFiles(files) {
    if (files.length > 0) {
      const url = processImageFiles(files);
      const uri = await getDataUri(url, canvas);
      return processUrl(uri);
    }
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
}
