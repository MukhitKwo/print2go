const buttons = document.querySelectorAll("#section-buttons button");
const sections = document.querySelectorAll(".section");

buttons.forEach((btn) => {
	btn.addEventListener("click", () => {
		// Remove active class from all buttons
		buttons.forEach((b) => b.classList.remove("active"));
		btn.classList.add("active");

		// Hide all sections
		sections.forEach((section) => section.classList.add("d-none"));

		// Show the corresponding section
		const sectionId = btn.dataset.section + "-section";
		document.getElementById(sectionId).classList.remove("d-none");
	});
});
