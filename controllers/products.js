const productSchema = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await productSchema.find();

  res.status(200).json({ msg: products, nbHits: products.length });
};
const getAllProducts = async (req, res) => {
  const { featured } = req.query;
  //if we have wrong query which isn't in db
  const queryObject = {};
  //just create obj contains valid query
  if (featured) queryObject.featured = featured ? true : false;
  //if queryObj is empty get all product
  const products = await productSchema.find(queryObject);
  res.status(200).json({ msg: products, nbHits: products.length });
};

module.exports = { getAllProducts, getAllProductsStatic };
