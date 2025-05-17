const profileFields = ["username", "password", "cellphone"];
const addressFields = ["country", "district", "adress", "postal_code", "receptor_name"];

profileFields.forEach(id => {
	const input = document.getElementById(id);
	if (input) {
		input.addEventListener("input", () => {
			document.getElementById("save-cancel-profile").classList.remove("d-none");
		});
	}
});

addressFields.forEach(id => {
	const input = document.getElementById(id);
	if (input) {
		input.addEventListener("input", () => {
			document.getElementById("save-cancel-adress").classList.remove("d-none");
		});
	}
});
