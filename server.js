require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

//DATABASE
const connectDB = require("./MongoDB");
connectDB();

//INITIALIZE APP
const app = express();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//ROUTERS ALWAYS BE BELOW MIDDLEWARE
app.use("/api/players", require("./Routes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
