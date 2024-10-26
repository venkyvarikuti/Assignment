const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, "../../..", process.env.NODE_ENV === "local" ? ".env.local" : ".env") });

const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const dialect = process.env.dialect || 'mysql';

module.exports = {
  local: {
    username,
    password,
    database,
    host,
    port,
    dialect
  },
  development: {
    username,
    password,
    database,
    host,
    port,
    dialect
  },
  production: {
    username,
    password,
    database,
    host,
    port,
    dialect
  },
  test: {
    username,
    password,
    database,
    host,
    port,
    dialect
  },
};
