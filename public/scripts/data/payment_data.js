function insert_update_payment() {
	let remember = document.getElementById("rememberPayment").checked;

	if (remember) {
		let session = localStorage.getItem("session");

		findByField("payments", "session", session)
			.then(() => {
				// info found (update)
				updatePaymentInfo(session);
			})
			.catch(() => {
				// didn't find (insert)
				insertPaymentInfo();
			});
	}
}

async function findByField(table, field, value) {
	const url = `/findOne?table=${table}&column=${field}&value=${encodeURIComponent(value)}`;

	return fetch(url).then((res) => {
		if (res.status === 404) {
			throw new Error("User not found");
		}
		if (!res.ok) {
			throw new Error("Network response was not ok");
		}
		return res.json();
	});
}

function insertPaymentInfo() {
	const info = {
		table: "payments",
		session: localStorage.getItem("session"),
		cardName: document.getElementById("cardName").value,
		cardNumber: document.getElementById("cardNumber").value,
		expirationDate: document.getElementById("expirationDate").value,
		cvv: document.getElementById("cvv").value,
	};

	fetch("/insert", {
		method: "POST",
		body: JSON.stringify(info),
		headers: {
			"Content-Type": "application/json", // Set content type as JSON
		},
	})
		.then((response) => {
			if (!response.ok) throw new Error("Failed to insert payment info");
			return response.json(); // Return JSON for further use if needed
		})
		.then((json) => {
			// console.log(json);
		})
		.catch((error) => {
			console.error("Insert error:", error);
			alert("Failed to register. Please try again.");
		});
}

function updatePaymentInfo(session) {
	const info = {
		session: session,
		cardName: document.getElementById("cardName").value,
		cardNumber: document.getElementById("cardNumber").value,
		expirationDate: document.getElementById("expirationDate").value,
		cvv: document.getElementById("cvv").value,
	};

	fetch("/update", {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			table: "payments",
			column: "session",
			value: session,
			new_value: info,
		}),
	})
		.then((res) => {
			if (!res.ok) throw new Error("Failed to update payment info");
			return res.json(); // Handle response if needed
		})
		.then((json) => {
			// console.log(json);
		})
		.catch((error) => {
			console.error("Update error:", error);
			alert("Failed to update. Please try again.");
		});
}

//* ==================================================================== ADRESS

function insert_update_adress() {
	let save = document.getElementById("saveDelivery").checked;

	if (save) {
		console.log("2");
		updateProfileInfo();
	}
}

function updateProfileInfo() {
	session = localStorage.getItem("session");

	console.log("3");

	const newProfileInfo = {
		country: document.getElementById("country").value,
		city: document.getElementById("city").value,
		adress: document.getElementById("adress").value,
		postalcode: document.getElementById("postalCode").value,
		receptorname: document.getElementById("receptorname").value,
	};

	console.log(newProfileInfo);

	fetch("/update", {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			table: "profiles",
			column: "email",
			value: session,
			new_value: newProfileInfo,
		}),
	})
		.then((res) => {
			if (!res.ok) throw new Error("Failed to update adress info");
			return res.json(); // Handle response if needed
		})
		.then((json) => {
			alert("Profile information updated successfully.");
		})
		.catch((error) => {
			console.error("Update error:", error);
			alert("Failed to update profile. Please try again.");
		});
}

//* ================================================================= LOAD

window.addEventListener("DOMContentLoaded", loadPaymentInfo);
async function loadPaymentInfo() {
	try {
		const session = localStorage.getItem("session"); // ✅ Still gets the session email

		// Fetch data to load or reload values
		const payment = await findByField("payments", "session", session);

		const adress = await findByField("profiles", "email", session);

		// Refill payment fields
		document.getElementById("cardName").value = payment.cardname || "test";
		document.getElementById("cardNumber").value = payment.cardnumber || "";
		document.getElementById("expirationDate").value = payment.expirationdate || "";
		document.getElementById("cvv").value = payment.cvv || "";

		// Refill address fields
		document.getElementById("country").value = adress.country || "";
		document.getElementById("city").value = adress.city || "";
		document.getElementById("adress").value = adress.adress || "";
		document.getElementById("postalCode").value = adress.postalcode || "";
		document.getElementById("receptorname").value = adress.receptorname || "";
	} catch (err) {
		console.error("Error reloading form values:", err);
		// alert("Failed to reload form values.");
	}
}
