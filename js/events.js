const form = document.getElementById("new-palette-entry");

loadHistory();

form.addEventListener("submit", e => {
	e.preventDefault();
	if (form.imagefile.files.length > 0) processUrl(processImageFiles(form.imagefile.files))
})

form.imagefile.addEventListener("change", e => processUrl(processImageFiles(e.currentTarget.files)))
form.imagefile.addEventListener("focus", e => e.target.classList.add("focus"))
form.imagefile.addEventListener("blur", e => e.target.classList.remove("focus"))
