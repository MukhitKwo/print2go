const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcryptjs");

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "public", "pages", "home_page.html"));
});

const client_config = require("./client_config");
const { Client } = require("pg");
const client = new Client(client_config);

client
	.connect()
	.then(() => console.log("\x1b[32m%s\x1b[0m", `Connected to PostgreSQL database '${client_config.database}'!`))
	.catch((err) => console.error("\x1b[31m%s\x1b[0m", "Connection error", err.stack));

//! INSERT
app.post("/insert", async (req, res) => {
	try {
		const { table, data } = req.body;

		if (!table || !data || typeof data !== "object") {
			return res.status(400).json({ error: "Missing or invalid fields" });
		}

		if (data.password) {
			data.password = encrypt(data.password);
		}

		const fields = Object.keys(data);
		const placeholders = fields.map((_, i) => `$${i + 1}`);
		const values = Object.values(data);

		const query = `
			INSERT INTO ${table} (${fields.join(", ")})
			VALUES (${placeholders.join(", ")})
			RETURNING *;
		`;

		const result = await client.query(query, values);

		res.json({ message: "Inserted!", rowCount: result.rowCount, inserted: result.rows[0] });
	} catch (err) {
		console.error("Insert error:", err);
		res.status(500).json({ error: err.message });
	}
});

//! UPDATE
app.put("/update", async (req, res) => {
	try {
		const { table, column, on_value, new_value } = req.body;

		if (!table || !column || !on_value || !new_value || typeof new_value !== "object") {
			return res.status(400).json({ error: "Missing or invalid fields" });
		}

		if (new_value.password) {
			new_value.password = encrypt(new_value.password);
		}

		const setFields = Object.keys(new_value);
		const setPlaceholders = setFields.map((key, i) => `${key} = $${i + 1}`);
		const setValues = Object.values(new_value);

		const filterPlaceholder = `$${setFields.length + 1}`;
		const query = `
				UPDATE ${table}
				SET ${setPlaceholders.join(", ")}
				WHERE ${column} = ${filterPlaceholder};
			`;

		const values = [...setValues, on_value];

		const result = await client.query(query, values);

		res.json({ success: true, modifiedCount: result.rowCount, updated: result.rows });
	} catch (err) {
		console.error("Update error:", err);
		res.status(500).json({ error: err.message });
	}
});

//! FIND THE ROW WITH X VALUE
app.get("/findOne", async (req, res) => {
	try {
		const { table, column, value } = req.query;

		if (!table || !column || !value) {
			return res.status(400).json({ error: "Missing table, column, or value" });
		}

		const query = `SELECT * FROM ${table} WHERE ${column} = $1 LIMIT 1;`;
		const result = await client.query(query, [value]);

		if (result.rows.length > 0) {
			res.json(result.rows[0]);
		} else {
			res.status(404).json({ message: "No matching row found" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

//! FIND ALL ROWS WITH X VALUE
app.get("/findAll", async (req, res) => {
	try {
		const { table, column, value } = req.query;

		if (!table || !column || !value) {
			return res.status(400).json({ error: "Missing table, column, or value" });
		}

		const query = `SELECT * FROM ${table} WHERE ${column} = $1;`;
		const result = await client.query(query, [value]);

		if (result.rows.length > 0) {
			res.json(result.rows);
		} else {
			res.status(404).json({ message: "No matching rows found" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

//! START THE SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`> Server running: http://localhost:${PORT}`);
});

function encrypt(rawPass) {
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(rawPass, salt);
	return hash;
}

app.post("/loginCheck", async (req, res) => {
	const { passwordLogin, passwordHash } = req.body;
	if (bcrypt.compareSync(passwordLogin, passwordHash)) {
		res.json({ success: true });
	} else {
		res.json({ success: false });
	}
});
