const functions = require("firebase-functions");

const express = require("express");
const cors = require("cors");
const request = require("request");
const webpush = require("web-push");
const _ = require("lodash");
const air = require("./air");
const weather = require("./weather");

const app = express();

app.use(cors());
app.enable("trust proxy");

app.get("/weather", weather.handler);

app.get("/air", air.handler);

app.get("/traffic", (req, res) => {
  res.send("other");
});

app.get("/other", (req, res) => {
  res.send("other");
});

exports.api = functions.https.onRequest(app);
