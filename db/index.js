// index.js will have utility functions that the rest of our application will use

const { Client } = require("pg"); // imports the pg module

const client = new Client("postgres://localhost:5432/juicebox-dev"); // supplies the db name and the location of the db

// this gets us access to the database

async function getAllUsers() {
  const { rows } = await client.query(`SELECT id, username FROM users;`);
  return rows;
}

async function createUser({ username, password }) {
  try {
    const { rows } = await client.query(
      `
    INSERT INTO users(username, password)
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;
    `,
      [username, password]
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  client,
  getAllUsers,
  createUser,
};
