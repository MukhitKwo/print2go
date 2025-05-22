async function updatePassword() {
	try {
		const emailToChange = document.getElementById("emailReset").value;
		const newPassword = document.getElementById("passReset1").value;
		const rewritePassword = document.getElementById("passReset2").value;

		if (!emailToChange) {
			alert("Please enter an email");
			return;
		} else if (!newPassword) {
			alert("Please enter the new password.");
			return;
		} else if (!rewritePassword) {
			alert("Please rewrite the new password.");
			return;
		}

		// First, check if the email exists
		const user = await findEmail("profiles", "email", emailToChange);

		if (!user) {
			alert("No account found with this email.");
			return;
		}

		// Email exists, proceed to update password
		const res = await fetch(`/update`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				table: "profiles",
				column: "email",
				value: emailToChange,
				new_value: { password: newPassword },
			}),
		});

		if (!res.ok) throw new Error("Failed to update password");
		window.location.href = "/pages/login_page.html";
		alert("Password updated successfully.");
	} catch (err) {
		console.error("Update failed:", err);
		alert("Failed to update password.");
	}
}

function findEmail(table, field, value) {
	// Changed: Modified the URL to pass 'table', 'column', and 'value' as query parameters
	const url = `/findOne?table=${table}&column=${field}&value=${encodeURIComponent(value)}`;

	return fetch(url).then((res) => {
		if (res.status === 404) {
			// Specific handling for "not found"
			throw new Error("User not found");
		}
		if (!res.ok) {
			throw new Error("Network response was not ok");
		}
		return res.json();
	});
}
