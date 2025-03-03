require("dotenv").config();
const express = require("express");
const app = express();
const { notFoundHandler, errorHandler } = require("./error");
const middlewares = require("./middlewares");
const apiRoutes = require("./api.routes");
const passportConfig = require("./passport")


app.use(passportConfig)
app.use(middlewares);
app.set("view engine", "ejs");

app.get("/health", (_, res) => res.status(200).json({ message: "ok" }));
// app.use(viewRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to hospital Backend!");
});
app.use(apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;