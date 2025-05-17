//* LOAD VALUES TO INPUT (IF EDITING)
function getIdFromURL() {
	const params = new URLSearchParams(window.location.search);
	return params.get("id");
}

async function findByField(table, field, value) {
	const url = `/findOne?table=${table}&column=${field}&value=${encodeURIComponent(value)}`;

	return fetch(url).then((res) => {
		if (res.status === 404) {
			throw new Error("User not found");
		}
		if (!res.ok) {
			throw new Error("Network response was not ok");
		}
		return res.json();
	});
}

async function loadPrintData() {
	const id = getIdFromURL();
	if (!id) {
		console.log("Creating new print.");
		return;
	}

	try {
		console.log("Loading print values.");

		const print = await findByField("prints", "id", id);
		console.log(print);

		document.getElementById("name").value = print.name || "";
		document.getElementById("quantity").value = print.quantity || "";
		document.getElementById("material").value = print.material || "";
		document.getElementById("color").value = print.color || "";
		document.getElementById("multicolor").checked = print.multicolor || false;
		document.getElementById("nozzleDiameter").value = print.nozzlediameter || "";
		document.getElementById("layerHeight").value = print.layerheight || "";
		document.getElementById("infillPercent").value = print.infillpercent || "";
		document.getElementById("infillType").value = print.infilltype || "";
		document.getElementById("wallLayers").value = print.walllayers || "";
		document.getElementById("topBottomLayers").value = print.topbottomlayers || "";
		document.getElementById("useSupport").checked = print.usesupport || false;
		document.getElementById("supportType").value = print.supporttype || "";
		document.getElementById("supportDensity").value = print.supportdensity || "";
		document.getElementById("smoothPrint").checked = print.smoothprint || false;
		document.getElementById("scaleX").value = print.scalex || "";
		document.getElementById("scaleY").value = print.scaley || "";
		document.getElementById("scaleZ").value = print.scalez || "";
		document.getElementById("adicionalInfo").value = print.adicionalinfo || "";
		document.getElementById("urgent").checked = print.urgent || false;

		//chnage submit button to save
		document.getElementById("submitPrint").classList.add("d-none");
		document.getElementById("updatePrint").classList.remove("d-none");

		//disable some navbar buttons and show Go back button
		document.getElementById("printpage").classList.add("d-none");
		document.getElementById("modelpage").classList.add("d-none");
		document.getElementById("goback").classList.remove("d-none");

		//show 3d render
		document.getElementById("viewer-container").classList.remove("hidden");
		document.getElementById("viewer-container").classList.add("visible");
		document.getElementById("fileTrigger").classList.remove("visible");
		document.getElementById("fileTrigger").classList.add("hidden");

		//disable remove/switch buttons
		document.getElementById("remove3dfile").disabled = true;
		document.getElementById("replace3dfile").disabled = true;
	} catch (err) {
		console.error("Error loading print data:", err);
	}
}

async function loadModelData() {
	const id = getIdFromURL();
	if (!id) {
		console.log("Creating new model.");
		return;
	}

	try {
		console.log("Loading model values.");

		const model = await findByField("models", "id", id);
		console.log(model);

		document.getElementById("name").value = model.name || "";
		document.getElementById("fileType").value = model.filetype || "";
		document.querySelector('input[name="unit"]:checked').id = model.unit || "";
		document.getElementById("description").value = model.description || "";
		document.getElementById("levelDetail").value = model.leveldetail || "";
		document.getElementById("addTolerance").checked = model.addtolerance || "";
		document.getElementById("urgent").checked = model.urgent || "";

		document.getElementById("submitModel").classList.add("d-none");
		document.getElementById("updateModel").classList.remove("d-none");

		document.getElementById("printpage").classList.add("d-none");
		document.getElementById("modelpage").classList.add("d-none");
		document.getElementById("goback").classList.remove("d-none");

		model.filenames.forEach((file) => {
			loadFileToGrid(file);
		});

		console.log(allFiles);
	} catch (err) {
		console.error("Error loading model data:", err);
	}
}

window.addEventListener("DOMContentLoaded", () => {
	const path = window.location.pathname;
	if (path.includes("print_page")) loadPrintData();
	else if (path.includes("model_page")) loadModelData();
});

//load file names on model page
function loadFileToGrid(file) {
	allFiles.push(file);

	const fileDiv = document.createElement("div");
	fileDiv.className = "p-1";
	const inputGroup = document.createElement("div");
	inputGroup.className = "input-group";

	const fileName = document.createElement("input");
	fileName.type = "text";
	fileName.className = "form-control bg-primary text-white border-primary rounded-0";
	fileName.value = file;
	fileName.readOnly = true;

	const sizeSpan = document.createElement("span");
	sizeSpan.className = "input-group-text bg-primary text-white border-primary rounded-0";
	sizeSpan.textContent = `${(file.size / 1024).toFixed(1)} KB`;

	const deleteBtn = document.createElement("button");
	deleteBtn.className = "btn btn-danger rounded-0";
	deleteBtn.textContent = "x";
	deleteBtn.title = "Remove file";
	deleteBtn.addEventListener("click", () => {
		allFiles = allFiles.filter((f) => !(f === file));
		fileGrid.removeChild(fileDiv);
	});
	inputGroup.appendChild(fileName);
	// inputGroup.appendChild(sizeSpan);
	inputGroup.appendChild(deleteBtn);
	fileDiv.appendChild(inputGroup);
	fileGrid.appendChild(fileDiv);
}
