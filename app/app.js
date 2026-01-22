require("dotenv").config();
const express = require("express");
const app = express();
const { notFoundHandler, errorHandler } = require("./error");
const middlewares = require("./middlewares");
const apiRoutes = require("./api.routes");
const passportConfig = require("./passport");
const sequelize = require("../database/connection");
const { deleteAllDataFromAllTable } = require("../utils/databases/databaseCleanup");

app.use(passportConfig);
app.use(middlewares);
app.set("view engine", "ejs");

app.get("/health", (_, res) => res.status(200).json({ message: "ok" }));

// ONE ENDPOINT - ONE FUNCTION - DELETE EVERYTHING
app.get("/api/delete-all-data", deleteAllDataFromAllTable);

app.get("/", (req, res) => {
  res.send("Welcome to ISP billing Server!");
});

app.use(apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;