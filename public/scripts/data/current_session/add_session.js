//* LOGIN
document.addEventListener("DOMContentLoaded", function () {
	document.getElementById("logIn").addEventListener("click", function () {
		const emailLogin = document.getElementById("emailLogin").value;
		const passwordLogin = document.getElementById("passwordLogin").value;

		if (emailLogin && passwordLogin) {
			findByField("profiles", "email", emailLogin)
				.then((user) => {
					if (user && user.password === passwordLogin) {
						localStorage.setItem("session", emailLogin); // Set session in localStorage
						window.location.href = "/pages/home_page.html"; // Redirect to home page
					} else {
						alert("Incorrect password.");
					}
				})
				.catch((err) => {
					console.error("Error:", err);
					alert("No account found with this email.");
				});
		} else {
			alert("Please enter both email and password.");
		}
	});
});

//* REGIST
document.addEventListener("DOMContentLoaded", function () {
	document.getElementById("regist").addEventListener("click", function () {
		const emailRegist = document.getElementById("emailRegist").value;
		const passwordRegist = document.getElementById("passwordRegist").value;
		const usernameRegist = document.getElementById("usernameRegist").value;
		const cellphoneRegist = document.getElementById("cellphoneRegist").value;
		const termsAgree = document.getElementById("termsAgree").checked;

		if (emailRegist && passwordRegist && usernameRegist && cellphoneRegist) {
			if (termsAgree) {
				findByField("profiles", "email", emailRegist)
					.then((user) => {
						if (user) {
							alert("An account with this email already exists.");
						}
					})
					.catch((err) => {
						// Email not found (404) — proceed with insertion
						if (err.message === "User not found") {
							const codeStr = Array.from(emailRegist)
								.map((c) => c.charCodeAt(0))
								.join("");

							insertNewUser({
								table: "profiles",
								email: emailRegist,
								password: passwordRegist,
								username: usernameRegist,
								cellphone: cellphoneRegist,
								userid: codeStr.slice(0, 8),
							});
						} else {
							console.error("Error:", err);
							alert("An error occurred while checking for existing email.");
						}
					});
			} else {
				alert("Agree with the licence.");
			}
		} else {
			alert("Please fill all inputs.");
		}
	});
});

// Function to insert a new user into the database (PostgreSQL)
function insertNewUser(userInfo) {
	fetch("/insert", {
		method: "POST",
		body: JSON.stringify(userInfo),
		headers: {
			"Content-Type": "application/json", // Set content type as JSON
		},
	})
		.then((response) => {
			if (!response.ok) throw new Error("Failed to insert user");
			return response.json();
		})
		.then((json) => {
			console.log("User inserted:", json);
			localStorage.setItem("session", userInfo.email); // Set session on successful registration
			window.location.href = "/pages/home_page.html"; // Redirect to home page
		})
		.catch((error) => {
			console.error("Insert error:", error);
			alert("Failed to register. Please try again.");
		});
}

// Function to find a user by a specific field (PostgreSQL)
function findByField(table, field, value) {
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
