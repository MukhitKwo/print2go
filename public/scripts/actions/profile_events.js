const profileFields = ["username", "password", "cellphone"];
const addressFields = ["country", "district", "adress", "postal_code", "receptor_name"];
const settingsFeild = ["darkMode"];

profileFields.forEach((id) => {
	const input = document.getElementById(id);
	if (input) {
		input.addEventListener("input", () => {
			document.getElementById("save-cancel-profile").classList.remove("d-none");
		});
	}
});

addressFields.forEach((id) => {
	const input = document.getElementById(id);
	if (input) {
		input.addEventListener("input", () => {
			document.getElementById("save-cancel-adress").classList.remove("d-none");
		});
	}
});

settingsFeild.forEach((id) => {
	const input = document.getElementById(id);
	if (input) {
		input.addEventListener("input", () => {
			document.getElementById("save-cancel-settings").classList.remove("d-none");
		});
	}
});

document.addEventListener("DOMContentLoaded", () => {
	const switchToggle = document.getElementById("darkMode");

	switchToggle.addEventListener("change", () => {
		if (switchToggle.checked) {
			//* Dark mode
			setTheme({
				"--color-1": "#000000",
				"--color-2": "#171717",
				"--color-3": "#434343",
				"--color-4": "#eaeaea",
				"--color-5": "#adabab",
			});
		} else {
			//* Light mode
			setTheme({
				"--color-1": "#ffffff",
				"--color-2": "#eaeaea",
				"--color-3": "#bcbcbc",
				"--color-4": "#1d1d1d",
				"--color-5": "#525252",
			});
		}
	});

	function setTheme(colors) {
		const root = document.documentElement;
		for (const [key, value] of Object.entries(colors)) {
			root.style.setProperty(key, value);
		}
	}
});
