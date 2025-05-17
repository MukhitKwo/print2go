let isFormChanged = false;

// Listen for changes on form inputs (text, textarea, etc.)
document.addEventListener("input", (e) => {
	if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) {
		isFormChanged = true;
	}
});

function preventNavigation(e) {
	if (isFormChanged) {
		const userConfirmed = confirm("You have unsaved changes. Are you sure you want to navigate away?");
		if (!userConfirmed) {
			e.preventDefault(); // Cancel navigation
		}
		// If userConfirmed is true, do nothing — allow navigation
	}
}

// Add event listeners to prevent navigation on link clicks
document.getElementById("printpage").addEventListener("click", preventNavigation);
document.getElementById("modelpage").addEventListener("click", preventNavigation);
document.getElementById("accountpage").addEventListener("click", preventNavigation);
document.getElementById("homepage").addEventListener("click", preventNavigation);
