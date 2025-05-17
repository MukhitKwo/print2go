function goToTab(tab) {
	const steps = {
		payment: document.getElementById("payment-section"),
		address: document.getElementById("address-section"),
		confirm: document.getElementById("confirm-section"),
	};

	// Hide all steps
	Object.values(steps).forEach((section) => section.classList.add("d-none"));

	// Show the selected one
	steps[tab].classList.remove("d-none");
}
