const list = document.getElementById('grid-items')
const tmpl = document.getElementById('grid-item-template')

const COPIES = 8;

for (let i = 0; i < COPIES; i++) {
	const clone = document.importNode(tmpl.content, true);
	list.appendChild(clone);
}
