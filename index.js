const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/days", (req, res) => {
  res.send("few days later start working");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// If2v3L4FeNcslPAh
