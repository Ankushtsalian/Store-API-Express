const productSchema = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await productSchema.find();

  res.status(200).json({ msg: products, nbHits: products.length });
};
const getAllProducts = async (req, res) => {
  res.status(200).json({ msg: "Products route" });
};

module.exports = { getAllProducts, getAllProductsStatic };
