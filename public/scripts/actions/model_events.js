const uploadArea = document.getElementById("uploadArea");
const fileInput = document.getElementById("fileInput");
const fileGrid = document.getElementById("fileGrid");

let allFiles = [];

uploadArea.addEventListener("click", () => {
	fileInput.click();
});

fileInput.addEventListener("change", () => {
	const newFiles = Array.from(fileInput.files);
	handleNewFiles(newFiles);
	fileInput.value = "";
});

uploadArea.addEventListener("dragover", (e) => {
	e.preventDefault();
	uploadArea.classList.add("drag-over");
});

uploadArea.addEventListener("dragleave", () => {
	uploadArea.classList.remove("drag-over");
});

uploadArea.addEventListener("drop", (e) => {
	e.preventDefault();
	uploadArea.classList.remove("drag-over");
	const droppedFiles = Array.from(e.dataTransfer.files);
	handleNewFiles(droppedFiles);
});

function handleNewFiles(newFiles) {
	newFiles.forEach((newFile) => {
		const isDuplicate = allFiles.some((existingFile) => existingFile.name === newFile.name && existingFile.size === newFile.size);
		if (!isDuplicate) {
			allFiles.push(newFile.name);
			addFileToGrid(newFile);
		}
	});
}

function addFileToGrid(file) {

	const fileDiv = document.createElement("div");
	fileDiv.className = "p-1";
	const inputGroup = document.createElement("div");
	inputGroup.className = "input-group";

	const fileName = document.createElement("input");
	fileName.type = "text";
	fileName.className = "form-control bg-primary text-white border-primary rounded-0";
	fileName.value = file.name;
	fileName.readOnly = true;

	const sizeSpan = document.createElement("span");
	sizeSpan.className = "input-group-text bg-primary text-white border-primary rounded-0";
	sizeSpan.textContent = `${(file.size / 1024).toFixed(1)} KB`;

	const deleteBtn = document.createElement("button");
	deleteBtn.className = "btn btn-danger rounded-0";
	deleteBtn.textContent = "x";
	deleteBtn.title = "Remove file";
	deleteBtn.addEventListener("click", () => {
		allFiles = allFiles.filter((f) => !(f.name === file.name && f.size === file.size));
		fileGrid.removeChild(fileDiv);
	});
	inputGroup.appendChild(fileName);
	inputGroup.appendChild(sizeSpan);
	inputGroup.appendChild(deleteBtn);
	fileDiv.appendChild(inputGroup);
	fileGrid.appendChild(fileDiv);
}
