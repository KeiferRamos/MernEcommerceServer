const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const users = require("./Router/users");
const products = require("./Router/products");
const admin = require("./Router/admin");
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  cors({
    origin: ["https://localhost:3000", "https://keiferramos.github.io"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(port);
  } catch (err) {
    console.log(err);
  }
};

app.use("/api/v1/products", products);
app.use("/api/v1/users", users);
app.use("/api/v1/admin", admin);
start();
