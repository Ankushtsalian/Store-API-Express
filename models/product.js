const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide Product name"],
  },
  price: {
    type: String,
    required: [true, "Please provide Product Price"],
  },
  featurede: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,

    enum: {
      values: ["ikea", "liddy", "caressa", "marcos"],
      message: "{VALUE} IS NOT SUPPORTED",
    },
    // enum: ["ikea", "liddy", "caressa", "marcos"],
  },
});

module.exports = mongoose.model("Product", productSchema);
