function insert_update_payment() {
	let session = localStorage.getItem("session");

	findByField("payments", "session", session)
		.then(() => {
			// info found (update)
			updatePaymentInfo(session);
		})
		.catch(() => {
			// didn't find (insert)
			insertPaymentInfo(session);
		});
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

function updatePaymentInfo(session) {
	const info = {
		session: session,
		cardName: document.getElementById("cardName").value,
		cardNumber: document.getElementById("cardNumber").value,
		expirationDate: document.getElementById("expirationDate").value,
		cvv: document.getElementById("cvv").value,
		rememberPayment: document.getElementById("rememberPayment").checked,
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

function insertPaymentInfo(session) {
	const info = {
		table: "payments",
		session: session,
		cardName: document.getElementById("cardName").value,
		cardNumber: document.getElementById("cardNumber").value,
		expirationDate: document.getElementById("expirationDate").value,
		cvv: document.getElementById("cvv").value,
		rememberPayment: document.getElementById("rememberPayment").checked,
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

//* ==================================================================== ADRESS

function updateProfileInfo() {
	if (!document.getElementById("saveDelivery").checked) {
		return;
	}

	session = localStorage.getItem("session");

	const newProfileInfo = {
		country: document.getElementById("country").value,
		city: document.getElementById("city").value,
		adress: document.getElementById("adress").value,
		postalcode: document.getElementById("postalCode").value,
		receptorname: document.getElementById("receptorname").value,
	};

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
		const session = localStorage.getItem("session");

		const payment = await findByField("payments", "session", session);
		if (payment.rememberpayment) {
			document.getElementById("cardName").value = payment.cardname || "";
			document.getElementById("cardNumber").value = payment.cardnumber || "";
			document.getElementById("expirationDate").value = payment.expirationdate || "";
			document.getElementById("cvv").value = payment.cvv || "";
			document.getElementById("rememberPayment").checked = payment.rememberpayment;
		}

		const adress = await findByField("profiles", "email", session);

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
