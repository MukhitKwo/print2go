function validatePrintForm() {
	const inputs = document.querySelectorAll("input, select");

	for (let input of inputs) {
		if (input.type !== "checkbox" && input.type !== "radio" && input.value.trim() === "" && input.id != "fileInput") {
			alert(`Please fill out the "${input.name}" field.`);
			input.focus();
			return false;
		}
	}
	return true;
}


function validatePaymentForm(sectionId) {
	const section = document.getElementById(sectionId);
	const fields = section.querySelectorAll("input, select");

	for (let field of fields) {
		// Skip checkboxes and radio buttons
		if (field.type === "checkbox" || field.type === "radio") continue;

		// Empty input value check
		if (field.value.trim() === "") {
			alert(`Please fill out the "${field.name}" field.`);
			field.focus();
			return false;
		}

		// For select fields, avoid default options like "Choose an option"
		if (field.tagName === "SELECT") {
			const firstOption = field.options[0];
			if (field.value === firstOption.value && /choose/i.test(firstOption.text)) {
				alert(`Please select a valid option for "${field.id}".`);
				field.focus();
				return false;
			}
		}
	}

	return true;
}
