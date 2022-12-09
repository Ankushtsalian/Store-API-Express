const productSchema = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await productSchema
    .find({ featured: false, rating: { $gte: 4.6 }, price: { $gt: 100 } })
    .select(["rating", "featured", "price"])
    .sort("rating");

  res.status(200).json({ msg: products, nbHits: products.length });
};
/**------------------------------------------------getAllProducts---------------------------------------------- */
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, limit, page, numericFilters } =
    req.query;
  //if we have wrong query which isn't in db
  const queryObject = {};

  //just create obj contains valid query
  if (featured) queryObject.featured = featured === "true" ? true : false;

  if (company) queryObject.company = company;

  if (name) queryObject.name = { $regex: name, $options: "i" };

  /**------------------------------------NUMERIC FILTERS --------------------------------- */

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };

    const regEx = /\b(<|>|>=|=|<|<=)\b/g;

    let filters = numericFilters.replace(regEx, (match) => {
      return `-${operatorMap[match]}-`;
    });
    //filters = price-$gt-40,rating-$gte-4
    //achieve===>{ price: { $gt: 100 }, rating : { $gte : 4.5 } }
    //"productSchema.find(queryObject)" <=============> "productSchema.find({field: price: { operator : $gt: value: 100 }, rating : { $gte : 4.5 } })"
    // remember to create an key has querry value named key as field
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((element) => {
      const [field, operator, value] = element.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }
  /**------------------------------------NUMERIC FILTERS --------------------------------- */

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

  /**--------------------------wait for result to complete in async--------------- */
  const products = await result;

  //if queryObj is empty get all product
  res
    .status(200)
    .json({ nbHits: products.length, msg: products, companyOptions });
};

module.exports = { getAllProducts, getAllProductsStatic };
