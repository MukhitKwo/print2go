function getPrintData() {
	return {
		table: "prints",
		session: localStorage.getItem("session"),
		model: document.getElementById("hiddenFileName").value,
		name: document.getElementById("name").value,
		quantity: document.getElementById("quantity").value,
		material: document.getElementById("material").value,
		color: document.getElementById("color").value,
		multicolor: document.getElementById("multicolor").checked,
		nozzleDiameter: document.getElementById("nozzleDiameter").value,
		layerHeight: document.getElementById("layerHeight").value,
		infillPercent: document.getElementById("infillPercent").value,
		infillType: document.getElementById("infillType").value,
		wallLayers: document.getElementById("wallLayers").value,
		topBottomLayers: document.getElementById("topBottomLayers").value,
		useSupport: document.getElementById("useSupport").checked,
		supportType: document.getElementById("supportType").value,
		supportDensity: document.getElementById("supportDensity").value,
		smoothPrint: document.getElementById("smoothPrint").checked,
		scaleX: document.getElementById("scaleX").value,
		scaleY: document.getElementById("scaleY").value,
		scaleZ: document.getElementById("scaleZ").value,
		adicionalInfo: document.getElementById("adicionalInfo").value,
		urgent: document.getElementById("urgent").checked,
		price: parseFloat(document.getElementById("cost").textContent),
		enddate: getDeliveryDate(parseInt(document.getElementById("time").textContent, 10)),
	};
}

function storePrintData() {
	if (validatePrintForm()) {
		const printdata = getPrintData();
		sessionStorage.setItem("data", JSON.stringify(printdata));
		window.location.href = "payment_page.html";
	}
}

function getModelData() {
	console.log(allFiles);

	return {
		table: "models",
		session: localStorage.getItem("session"),
		name: document.getElementById("name").value,
		fileType: document.getElementById("fileType").value,
		unit: document.querySelector('input[name="unit"]:checked').id,
		description: document.getElementById("description").value,
		levelDetail: document.getElementById("levelDetail").value,
		addTolerance: document.getElementById("addTolerance").checked,
		urgent: document.getElementById("urgent").checked,
		fileNames: allFiles,
		price: 5.0,
		enddate: getDeliveryDate(5),
	};
}

function storeModelData() {
	if (validatePrintForm()) {
		const modelData = getModelData();
		sessionStorage.setItem("data", JSON.stringify(modelData));
		window.location.href = "payment_page.html";
	}
}

function insertData() {
	const data = JSON.parse(sessionStorage.getItem("data"));

	document.getElementById("confirm-days").textContent = getDaysFromToday(data.enddate);

	if (!data) {
		console.warn("No data found in sessionStorage.");
		return;
	}

	table = data.table;
	delete data.table;

	fetch("/insert", {
		method: "POST",
		body: JSON.stringify({ table: table, data: data }),
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((json) => {
			console.log("Server response:", json);
			// Optional: clear storage or redirect again
			// sessionStorage.removeItem("data");
		})
		.catch((error) => {
			console.error("Error sending model job data:", error);
		});
}

function getDeliveryDate(days) {
	const today = new Date();
	const deliveryDate = new Date();

	if (document.getElementById("urgent").checked) {
		days *= 1.6;
	}

	deliveryDate.setDate(today.getDate() + days);

	// Format as YYYY-MM-DD
	const year = deliveryDate.getFullYear();
	const month = String(deliveryDate.getMonth() + 1).padStart(2, "0"); // months are 0-based
	const day = String(deliveryDate.getDate()).padStart(2, "0");

	const formattedDate = `${year}-${month}-${day}`;

	console.log("Estimated delivery date:", formattedDate);
	return formattedDate;
}

function getDaysFromToday(dateStr) {
	const today = new Date();
	const targetDate = new Date(dateStr);

	// Normalize both to UTC midnight to avoid time differences
	const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
	const utcTarget = Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

	const msPerDay = 24 * 60 * 60 * 1000;
	const diffInMs = utcTarget - utcToday;
	const days = Math.round(diffInMs / msPerDay);

	console.log("Days from today:", days);
	return days;
}

//*============================================================= UPDATE

function getTableFromPage() {
	const page = window.location.pathname;
	if (page.includes("print_page")) return "prints";
	if (page.includes("model_page")) return "models";
	return null;
}

async function updateData() {
	try {
		const id = new URLSearchParams(window.location.search).get("id");
		const table = getTableFromPage();

		// Decide which data to use
		let data;
		if (table === "prints") {
			data = getPrintData();
		} else if (table === "models") {
			data = getModelData();
			console.log(data.fileNames);
		} else {
			throw new Error("Unknown table or unsupported page.");
		}

		delete data.table;

		const res = await fetch(`/update`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ table, column: "id", value: id, new_value: data }),
		});

		if (!res.ok) throw new Error("Failed to update data");

		alert("Data updated successfully.");
	} catch (err) {
		console.error("Update failed:", err);
		alert("Failed to update data.");
	}
}
