document.addEventListener("DOMContentLoaded", () => {
	const loginDiv = document.getElementById("loginTab");
	const registDiv = document.getElementById("registTab");
	const resetDiv = document.getElementById("resetTab");

	document.getElementById("toggleToRegist")?.addEventListener("click", (e) => {
		e.preventDefault();
		loginDiv.classList.add("d-none");
		resetDiv.classList.add("d-none");
		registDiv.classList.remove("d-none");
	});

	document.getElementById("toggleToLogin1")?.addEventListener("click", (e) => {
		e.preventDefault();
		registDiv.classList.add("d-none");
		resetDiv.classList.add("d-none");
		loginDiv.classList.remove("d-none");
	});

	document.getElementById("toggleToLogin2")?.addEventListener("click", (e) => {
		e.preventDefault();
		registDiv.classList.add("d-none");
		resetDiv.classList.add("d-none");
		loginDiv.classList.remove("d-none");
	});

	document.getElementById("toggleToRecover")?.addEventListener("click", (e) => {
		e.preventDefault();
		loginDiv.classList.add("d-none");
		registDiv.classList.add("d-none");
		resetDiv.classList.remove("d-none");
	});
});
