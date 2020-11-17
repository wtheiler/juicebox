// grab our client from destructuring from db/index.js (modeule.export)

const { client, getAllUsers, createUser } = require("./index");

async function testDB() {
  try {
    //connect the client to the database

    // client.connect();
    console.log("Starting to test database...");

    // queries are promises, so we can await them
    // const { rows } = await client.query(`SELECT * FROM users;`);
    const users = await getAllUsers();
    console.log("getAllUsers:", users);
    console.log("Finished database tests!");

    console.log(users);
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  } /*finally {
    client.end();
  }*/
}

// testDB();

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`DROP TABLE IF EXISTS users;`);
    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username varchar(255) UNIQUE NOT NULL,
          password varchar(255) NOT NULL
        );
      `);
    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error) {
    console.error(error);
    throw error;
  } /*finally {
    client.end();
  }*/
}

async function createInitialUsers() {
  try {
    console.log("Starting to create new users");

    const albert = await createUser({
      username: "albert",
      password: "bertie99",
    });

    const sandra = await createUser({
      username: "sandra",
      password: "abc_123",
    });

    const glamgal = await createUser({
      username: "glamgal",
      password: "def_456",
    });

    console.log("finished creating users");
  } catch (error) {
    console.log("Error creating users");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
