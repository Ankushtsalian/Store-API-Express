require("dotenv").config();

const express = require("express");
const app = express();

const connectDB = require("./db/connect");

const productSchema = require("./models/product");
const jsonProducts = require("./products.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await productSchema.deleteMany();
    await productSchema.create(jsonProducts);
    console.log("success");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
