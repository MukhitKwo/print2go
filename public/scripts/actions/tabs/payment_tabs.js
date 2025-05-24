function goToPayment() {
	const payment = document.getElementById("payment-section");
	const address = document.getElementById("address-section");
	const confirm = document.getElementById("confirm-section");

	payment.classList.remove("d-none");
	address.classList.add("d-none");
	confirm.classList.add("d-none");
}

function goToAdress() {
	const payment = document.getElementById("payment-section");
	const address = document.getElementById("address-section");
	const confirm = document.getElementById("confirm-section");

	payment.classList.add("d-none");
	address.classList.remove("d-none");
	confirm.classList.add("d-none");
}

function goToConfirm() {
	const payment = document.getElementById("payment-section");
	const address = document.getElementById("address-section");
	const confirm = document.getElementById("confirm-section");
	const tabImg1 = document.getElementById("tabImg1");
	// const tabImg2 = document.getElementById("tabImg2");

	payment.classList.add("d-none");
	address.classList.add("d-none");
	confirm.classList.remove("d-none");
	tabImg1.classList.remove("d-md-block");
	// tabImg2.classList.remove("d-none");
}
