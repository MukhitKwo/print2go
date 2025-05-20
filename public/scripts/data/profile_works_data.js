showWorks(localStorage.getItem("session"));

function showWorks(session) {
	const pages = ["prints", "models"];

	pages.forEach((page) => {
		fetch(`/findAll?table=${page}&column=session&value=${encodeURIComponent(session)}`)
			.then((res) => {
				if (!res.ok) throw new Error(`Error fetching data from ${page}`);
				return res.json();
			})
			.then((data) => {
				if (page === "prints") {
					displayPrints(data);
				} else if (page === "models") {
					displayModels(data);
				}
			})
			.catch((err) => {
				console.log(`No works from ${page}`);
			});
	});
}

function displayPrints(data) {
	const section = document.getElementById("printed-cards");
	section.innerHTML = ""; // Clear previous content

	const row = document.createElement("div");
	row.classList.add("row", "g-3");

	document.getElementById("n_prints").textContent = data.length;
	document.getElementById("n_prints_title").textContent = data.length;

	data.forEach((item) => {
		const col = document.createElement("div");
		col.classList.add("col-md-4", "d-flex", "justify-content-center");

		const card = document.createElement("div");
		card.classList.add("card", "border-0", "h-100", "ratio", "ratio-1x1", "overflow-hidden", "p-0");
		card.style.cursor = "pointer";
		card.style.backgroundColor = "var(--color-4)";
		card.style.color = "white";

		card.dataset.id = item.id;
		card.dataset.type = "print";

		card.innerHTML = `
			<div class="d-flex flex-column w-100 h-100">
				<img src="../img/profile_imgs/cubePrint.jpg" class="card-img-top object-fit-cover" style="height: 70%;" alt="Card image">
				<div class="d-flex flex-column justify-content-start text-start p-2" style="flex: 1;">
					<p class="fw-semibold small mb-1 text-muted">${deliveryStatus(item.enddate)}</p>
					<h6 class="card-title mb-1" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.name}</h6>
					<p class="card-text text-muted small mt-2">Click to show more info about print</p>
				</div>
			</div>`;

		card.addEventListener("click", () => {
			window.location.href = `print_page.html?id=${item.id}`;
		});

		col.appendChild(card);
		row.appendChild(col);
	});

	section.appendChild(row);
}

function displayModels(data) {
	const section = document.getElementById("modeled-cards");
	section.innerHTML = ""; // Clear previous content

	const row = document.createElement("div");
	row.classList.add("row", "g-3");

	document.getElementById("n_models").textContent = data.length;
	document.getElementById("n_models_title").textContent = data.length;

	data.forEach((item) => {
		const col = document.createElement("div");
		col.classList.add("col-md-4", "d-flex", "justify-content-center");

		const card = document.createElement("div");
		card.classList.add("card", "border-0", "h-100", "ratio", "ratio-1x1", "overflow-hidden", "p-0");
		card.style.cursor = "pointer";
		card.style.backgroundColor = "var(--color-4)";
		card.style.color = "white";

		card.dataset.id = item.id;
		card.dataset.type = "model";

		card.innerHTML = `
			<div class="d-flex flex-column w-100 h-100">
				<img src="../img/profile_imgs/cubeModel.jpg" class="card-img-top object-fit-cover" style="height: 70%;" alt="Card image">
				<div class="d-flex flex-column justify-content-start text-start p-2" style="flex: 1;">
					<p class="fw-semibold small mb-1 text-muted">${deliveryStatus(item.enddate)}</p>
					<h6 class="card-title mb-1" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.name}</h6>
					<p class="card-text text-muted small mt-2">Click to show more info about model</p>
				</div>
			</div>`;

		card.addEventListener("click", () => {
			window.location.href = `model_page.html?id=${item.id}`;
		});

		col.appendChild(card);
		row.appendChild(col);
	});

	section.appendChild(row);
}

function deliveryStatus(date) {
	const inputDate = new Date(date);
	const today = new Date();

	// Normalize both dates to UTC midnight
	const utcInput = Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth(), inputDate.getUTCDate());
	const utcToday = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

	if (utcInput > utcToday) {
		return "In progress...";
	} else {
		return "Delivered!";
	}
}
