const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

const express = require("express");
const cors = require("cors");
const _ = require("lodash");
const air = require("./air");
const weather = require("./weather");
const push = require("./push");

const app = express();

app.use(cors());
app.enable("trust proxy");

// app.get("/weather", weather.handler);
// app.get("/air", air.handler);

app.get("/ping", push.ping);

app.get("/other", (req, res) => {
  res.send("other");
});

exports.api = functions.https.onRequest(app);
