const readline = require("readline");
const { Client } = require("pg");

function askQuestion(query, defaultValue = "") {
	return new Promise((resolve) => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		rl.question(query, (answer) => {
			rl.close();
			resolve(answer || defaultValue);
		});
	});
}

async function getConfigFromUser() {
	console.log("Press Enter to skip");
	const host = await askQuestion("< Host (default: localhost): ", "localhost");
	const port = parseInt(await askQuestion("< Port (default: 5432): ", "5432"), 10);
	const user = await askQuestion("< User (default: postgres): ", "postgres");
	const password = await askQuestion("< Password (default: admin): ", "admin");

	return {
		host,
		port,
		user,
		password,
		database: "postgres",
	};
}

const dbName = "print2go";

async function createDatabaseIfNotExists(config) {
	const client = new Client(config);
	await client.connect();

	const res = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);

	if (res.rowCount === 0) {
		await client.query(`CREATE DATABASE "${dbName}" WITH ENCODING 'UTF8' TEMPLATE template1`);
		console.log(`Database '${dbName}' created.`);
        // localStorage.removeItem("session");
	} else {
		console.log(`Database '${dbName}' already exists.`);
	}

	await client.end();
}

async function createTableIfNotExists(config) {
	const dbClient = new Client({ ...config, database: dbName });
	await dbClient.connect();

	await dbClient.query(`
        CREATE TABLE IF NOT EXISTS prints (
            id SERIAL PRIMARY KEY,
            session VARCHAR(100) NOT NULL,
            name VARCHAR(255) NOT NULL,
            quantity INTEGER,
            material VARCHAR(30),
            color VARCHAR(30),
            multicolor BOOLEAN,
            nozzlediameter NUMERIC(3,2),
            layerheight NUMERIC(4,2),
            infillpercent INTEGER,
            infilltype VARCHAR(30),
            walllayers INTEGER,
            topbottomlayers INTEGER,
            usesupport BOOLEAN,
            supporttype VARCHAR(255),
            supportdensity NUMERIC(5,2),
            smoothprint BOOLEAN,
            scalex NUMERIC(6,2),
            scaley NUMERIC(6,2),
            scalez NUMERIC(6,2),
            adicionalinfo TEXT,
            urgent BOOLEAN,
            price NUMERIC(10,2),
            enddate DATE,
            model VARCHAR(50)
        )
    `);

	await dbClient.query(`
        CREATE TABLE IF NOT EXISTS models (
            id SERIAL PRIMARY KEY,
            session TEXT NOT NULL,
            name TEXT NOT NULL,
            filetype VARCHAR(10),
            unit VARCHAR(10),
            description TEXT,
            leveldetail VARCHAR(25),
            addtolerance BOOLEAN,
            urgent BOOLEAN,
            filenames TEXT[],
            price NUMERIC(10,2),
            enddate DATE,
            CONSTRAINT user_models_unit_check CHECK (unit IN ('cm', 'in'))
        )
    `);

	await dbClient.query(`
        CREATE TABLE IF NOT EXISTS payments (
            session VARCHAR(60) PRIMARY KEY,
            cardname VARCHAR(50),
            cardnumber BIGINT,
            expirationdate VARCHAR(10),
            cvv SMALLINT,
            rememberpayment BOOLEAN
        )
    `);

	await dbClient.query(`
        CREATE TABLE IF NOT EXISTS profiles (
            email VARCHAR(100) PRIMARY KEY,
            username VARCHAR(50),
            password VARCHAR(60),
            cellphone VARCHAR(20),
            country VARCHAR(30),
            city VARCHAR(40),
            adress VARCHAR(50),
            postalcode VARCHAR(20),
            receptorname VARCHAR(100),
            userid INTEGER,
            darkmode BOOLEAN
        )
    `);

	await dbClient.end();
	console.log(`Tables created in database '${dbName}'.`);
}

async function main() {
	try {
		const config = await getConfigFromUser();
		await createDatabaseIfNotExists(config);
		await createTableIfNotExists(config);
	} catch (err) {
		console.error("Error:", err);
	}
}

main();
