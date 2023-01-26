require("dotenv").config();
module.exports = {
  development: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres"
  },
  Udevelopment: {
    use_env_variable: "DATABASE_URL_CLOUD",
    dialect: "postgres"
  },
  test: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres"
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres"
  }
};
