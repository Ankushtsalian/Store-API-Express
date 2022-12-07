const productSchema = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await productSchema.find();

  res.status(200).json({ msg: products, nbHits: products.length });
};
const getAllProducts = async (req, res) => {
  const query = req.query;
  const products = await productSchema.find(query);
  res.status(200).json({ msg: products, nbHits: products.length });
};

module.exports = { getAllProducts, getAllProductsStatic };
