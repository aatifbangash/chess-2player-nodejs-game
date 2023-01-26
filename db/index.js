require("dotenv").config();

const pgp = require("pg-promise")();

let connection;

if (process.env.NODE_ENV === "Udevelopment") {
  connection = pgp(process.env.DATABASE_URL_CLOUD);
} else {
  connection = pgp(process.env.DATABASE_URL);
}
module.exports = connection;
