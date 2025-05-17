const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "pages", "home_page.html"));
});

const { Client } = require("pg");

const client = new Client({
	host: "localhost",
	port: 5432,
	user: "postgres",
	password: "admin",
	database: "print2goDB",
});

client
	.connect()
	.then(() => console.log("Connected to PostgreSQL database!"))
	.catch((err) => console.error("Connection error", err.stack));

//! INSERT
app.post("/insert", async (req, res) => {
	try {
		let query, values;

		if (req.body.table === "prints") {
			query = `
				INSERT INTO prints (
				session, model, name, quantity, material, color, multicolor,
				nozzleDiameter, layerHeight, infillPercent, infillType,
				wallLayers, topBottomLayers, useSupport, supportType,
				supportDensity, smoothPrint, scaleX, scaleY, scaleZ,
				adicionalInfo, urgent, price, enddate
				) VALUES (
				$1, $2, $3, $4, $5, $6,
				$7, $8, $9, $10,
				$11, $12, $13, $14,
				$15, $16, $17, $18, $19,
				$20, $21, $22, $23, $24
				) RETURNING id;`;
			values = [
				req.body.session,
				req.body.model,
				req.body.name,
				req.body.quantity,
				req.body.material,
				req.body.color,
				req.body.multicolor,
				req.body.nozzleDiameter,
				req.body.layerHeight,
				req.body.infillPercent,
				req.body.infillType,
				req.body.wallLayers,
				req.body.topBottomLayers,
				req.body.useSupport,
				req.body.supportType,
				req.body.supportDensity,
				req.body.smoothPrint,
				req.body.scaleX,
				req.body.scaleY,
				req.body.scaleZ,
				req.body.adicionalInfo,
				req.body.urgent,
				req.body.price,
				req.body.enddate,
			];
		} else if (req.body.table === "models") {
			query = `
                INSERT INTO models (
                session, name, fileType, unit, description,
                levelDetail, addTolerance, urgent, fileNames
				, price, enddate
                ) VALUES (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9, $10, $11
                );`;
			values = [
				req.body.session,
				req.body.name,
				req.body.fileType,
				req.body.unit,
				req.body.description,
				req.body.levelDetail,
				req.body.addTolerance,
				req.body.urgent,
				req.body.fileNames,
				req.body.price,
				req.body.enddate,
			];
		} else if (req.body.table === "profiles") {
			query = `
				INSERT INTO profiles (
				email, username, password, cellphone,
				country, city, adress, postalCode, receptorName
				) VALUES (
				$1, $2, $3, $4,
				NULL, NULL, NULL, NULL, NULL
				);`;

			values = [req.body.email, req.body.username, req.body.password, req.body.cellphone];
		} else if (req.body.table === "payments") {
			query = `
				INSERT INTO payments (
				session, cardName, cardNumber, expirationDate,cvv) 
				VALUES ($1, $2, $3, $4, $5);`;

			values = [req.body.session, req.body.cardName, req.body.cardNumber, req.body.expirationDate, req.body.cvv];
		} else {
			return res.status(400).json({ error: "Unknown table" });
		}

		const result = await client.query(query, values);
		res.json({ message: "Inserted!", rowCount: result.rowCount });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
});

//! UPDATE
app.put("/update", async (req, res) => {
	try {
		const { table, column, value, new_value } = req.body;

		if (!table || !column || !value || !new_value || typeof new_value !== "object") {
			return res.status(400).json({ error: "Missing or invalid fields" });
		}

		// Build SET clause and values array
		const setFields = Object.keys(new_value);
		const setPlaceholders = setFields.map((key, i) => `${key} = $${i + 1}`);
		const setValues = Object.values(new_value);

		// Add filter value as the final parameter
		const filterPlaceholder = `$${setFields.length + 1}`;
		const query = `
				UPDATE ${table}
				SET ${setPlaceholders.join(", ")}
				WHERE ${column} = ${filterPlaceholder};
			`;

		const values = [...setValues, value];

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
	console.log(`Server running: http://localhost:${PORT}`);
});
