const productSchema = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await productSchema.find({});

  res.status(200).json({ msg: products, nbHits: products.length });
};
/**------------------------------------------------getAllProducts---------------------------------------------- */
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, limit, page } = req.query;
  //if we have wrong query which isn't in db
  const queryObject = {};

  //just create obj contains valid query
  if (featured) queryObject.featured = featured === "true" ? true : false;

  if (company) queryObject.company = company;

  if (name) queryObject.name = { $regex: name, $options: "i" };
  /**----------------find all products based on valid query string---------------- */
  let result = productSchema.find(queryObject);

  /**------------------------------------Sort it --------------------------------- */
  if (sort) {
    const sortValue = sort.split(",").join(" ");
    result = result.sort(sortValue);
  } else result = result.sort("createdAt");

  /**------------------------------------Select it --------------------------------- */
  let resultCopy = productSchema.find();

  let companyOptions = await resultCopy.select("company");

  if (fields) {
    const fieldValue = fields.split(",").join(" ");
    result = result.select(fieldValue);
  }
  /**------------------------------------PAGINATION --------------------------------- */
  if (page) {
    const pageNumber = Number(page) || 1;
    const limitRecords = Number(limit) || 10;

    const skip = (pageNumber - 1) * limitRecords;
    result = result.skip(skip).limit(limitRecords);
  }
  /**------------------------------------PAGINATION --------------------------------- */

  /**--------------------------wait for result to complete in async--------------- */
  const products = await result;

  //if queryObj is empty get all product
  res
    .status(200)
    .json({ msg: products, nbHits: products.length, companyOptions });
};

module.exports = { getAllProducts, getAllProductsStatic };
