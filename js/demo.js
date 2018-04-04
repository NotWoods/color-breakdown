const COPIES = 8;

for (let i = 0; i < COPIES; i++) {
	const clone = document.importNode(itemTemplate.content, true);
	list.appendChild(clone);
}
