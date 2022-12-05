require("dotenv").config();

const express = require("express");
const app = express();

const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");
const connectDB = require("./db/connect");

const productRouter = require("./routes/products");
//middleware
app.use(express.json());

//Routes

app.get("/", (req, res) => {
  res.send(
    '<h1>Store Api <a href="/api/v1/products">   Product Route</a></h1>'
  );
});

//Product Routes
app.use("/api/v1/products", productRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening at ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
