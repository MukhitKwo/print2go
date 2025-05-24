async function findByField(table, field, value) {
	const url = `/findOne?table=${table}&column=${field}&value=${encodeURIComponent(value)}`;

	const res = await fetch(url);
	if (!res.ok) throw new Error("Network response was not ok");
	return res.json();
}

async function loadProfileInfo() {
	try {
		const session = localStorage.getItem("session"); // ✅ Still gets the session email

		// Fetch data to load or reload values
		const data = await findByField("profiles", "email", session);

		document.getElementById("profile-username").textContent = data.username || "Loading...";
		document.getElementById("profile-id").textContent = data.userid || "Loading...";

		// Refill profile fields
		document.getElementById("username").value = data.username || "";
		document.getElementById("email").value = data.email || "";
		document.getElementById("password").value = data.password || "";
		document.getElementById("cellphone").value = data.cellphone || "";

		// Refill adress fields
		document.getElementById("country").value = data.country || "";
		document.getElementById("city").value = data.city || "";
		document.getElementById("adress").value = data.adress || "";
		document.getElementById("postal_code").value = data.postalcode || "";
		document.getElementById("receptor_name").value = data.receptorname || "";

		document.getElementById("darkMode").checked = data.darkmode;

		// Hide save/cancel buttons
		document.getElementById("save-cancel-profile").classList.add("d-none");
		document.getElementById("save-cancel-adress").classList.add("d-none");
	} catch (err) {
		console.error("Error reloading form values:", err);
		// alert("Failed to reload form values.");
	}
}

window.addEventListener("DOMContentLoaded", loadProfileInfo);
document.getElementById("cancel-profile").addEventListener("click", loadProfileInfo);
document.getElementById("cancel-adress").addEventListener("click", loadProfileInfo);
document.getElementById("cancel-settings").addEventListener("click", loadProfileInfo);

document.getElementById("save-profile").addEventListener("click", updateProfileData);
document.getElementById("save-adress").addEventListener("click", updateProfileData);
document.getElementById("save-settings").addEventListener("click", updateProfileData);

async function updateProfileData() {
	try {
		const updatedData = {
			username: document.getElementById("username").value,
			password: document.getElementById("password").value,
			cellphone: document.getElementById("cellphone").value,
			country: document.getElementById("country").value,
			city: document.getElementById("city").value,
			adress: document.getElementById("adress").value,
			postalCode: document.getElementById("postal_code").value,
			receptorName: document.getElementById("receptor_name").value,
			darkmode: document.getElementById("darkMode").checked,
		};
		//todo maybe only update when user updates username
		document.getElementById("profile-username").textContent = document.getElementById("username").value;

		localStorage.setItem("darkMode", updatedData.darkmode);

		const value = document.getElementById("email").value;

		const res = await fetch(`/update`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ table: "profiles", column: "email", on_value: value, new_value: updatedData }),
		});

		if (!res.ok) throw new Error("Failed to update profile");

		// Hide the entire div containing the buttons after the update
		document.getElementById("save-cancel-profile").classList.add("d-none");
		document.getElementById("save-cancel-adress").classList.add("d-none");
		document.getElementById("save-cancel-settings").classList.add("d-none");
	} catch (err) {
		console.error("Update failed:", err);
		alert("Failed to update profile.");
	}
}
