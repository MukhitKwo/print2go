document.addEventListener("DOMContentLoaded", () => {
	darkMode = localStorage.getItem("darkMode");
	// localStorage.setItem("darkMode", darkMode);

	// console.log(darkMode);
	// console.log(getComputedStyle(document.documentElement).getPropertyValue("--color-2"));

	if (darkMode) {
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

	function setTheme(colors) {
		const root = document.documentElement;
		// root.style.setProperty("--color-2", "#555555");
		// console.log(root.style.cssText);
		console.log(document.body.style.cssText);

		for (const [key, value] of Object.entries(colors)) {
			console.log(key, value);

			root.style.setProperty(key, value);
		}
	}
});
