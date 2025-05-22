document.getElementById("fileTrigger").addEventListener("click", function () {
    document.getElementById("stlFileInput").click();
  });


function qualityPreset() {
	const preset = document.getElementById("qualityPreset").value;

	// Convert the selected value to a float
	const nozzle = parseFloat(preset);
	let layer = "";

	// Define the matching layer heights
	const presetMap = {
		0.2: "0.1",
		0.3: "0.2",
		0.4: "0.2",
		0.5: "0.25",
		0.6: "0.3",
		0.8: "0.4",
	};

	layer = presetMap[preset];

	// Set values in the UI
	document.getElementById("nozzleDiameter").value = nozzle.toFixed(1);
	document.getElementById("layerHeight").value = layer;
}

function qualityPresetSetCustom() {
	document.getElementById("qualityPreset").value = "custom";
}

function durabilityPreset() {
	const preset = document.getElementById("durabilityPreset").value;

	// Get all the related inputs
	const infillPercent = document.getElementById("infillPercent");
	const infillType = document.getElementById("infillType");
	const wallLayers = document.getElementById("wallLayers");
	const topBottomLayers = document.getElementById("topBottomLayers");

	// Apply presets based on selection
	if (preset === "w") {
		// Weak
		infillPercent.value = 10;
		infillType.value = "triangular";
		wallLayers.value = 2;
		topBottomLayers.value = 3;
	} else if (preset === "a") {
		// Average
		infillPercent.value = 20;
		infillType.value = "cubic";
		wallLayers.value = 3;
		topBottomLayers.value = 4;
	} else if (preset === "s") {
		// Strong
		infillPercent.value = 40;
		infillType.value = "hexagonal";
		wallLayers.value = 4;
		topBottomLayers.value = 5;
	}
}

function durabilityPresetSetCustom() {
	document.getElementById("durabilityPreset").value = "custom";
}

document.getElementById("useSupport").addEventListener("change", function () {
	const isChecked = this.checked;
	document.getElementById("supportType").disabled = !isChecked;
	document.getElementById("supportDensity").disabled = !isChecked;
});

document.getElementById("uniformScale").addEventListener("change", function () {
	const isChecked = this.checked;
	document.getElementById("scaleXYZ").disabled = !isChecked;
	document.getElementById("scaleX").disabled = isChecked;
	document.getElementById("scaleY").disabled = isChecked;
	document.getElementById("scaleZ").disabled = isChecked;

	if (isChecked) {
		const value = document.getElementById("scaleXYZ").value;
		document.getElementById("scaleX").value = value;
		document.getElementById("scaleY").value = value;
		document.getElementById("scaleZ").value = value;
	}
});

function scaleValues() {
	const value = document.getElementById("scaleXYZ").value;
	document.getElementById("scaleX").value = value;
	document.getElementById("scaleY").value = value;
	document.getElementById("scaleZ").value = value;
}

function selectColor(colorName) {
    document.getElementById('selectedColor').value = colorName;
    document.querySelectorAll('.color-box').forEach(box => box.classList.remove('selected'));
    event.target.classList.add('selected');
}


