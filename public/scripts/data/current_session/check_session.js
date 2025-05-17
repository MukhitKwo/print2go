document.addEventListener("DOMContentLoaded", function () {
	const user = localStorage.getItem("session");

	if (user) {
		console.log("User is logged in as:", user);

		// Enable and activate the Print Page button
		const printBtn = document.getElementById("printPageBtn");
		if (printBtn) {
			printBtn.classList.remove("disabled");
			printBtn.classList.add("active");
		}

		// Enable and activate the Model Page button
		const modelBtn = document.getElementById("modelPageBtn");
		if (modelBtn) {
			modelBtn.classList.remove("disabled");
			modelBtn.classList.add("active");
		}

		const accountBtn = document.getElementById("accountBtn");
		if (accountBtn) {
			accountBtn.setAttribute("href", "/pages/print_page.html");
		}
		// Hide the Sign Up button
		document.getElementById("signUpBtn")?.classList.add("d-none");

		// Show the Profile button
		document.getElementById("profileBtn")?.classList.remove("d-none");
	}
});
