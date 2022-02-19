require("express-async-errors");
require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const morgan = require("morgan");
const cors = require("cors");

// DB
const connectDB = require("./db/connect");
// express
const app = express();

app.use(express.static("./public"));
app.use(express.json());
app.use(morgan("tiny"));

// Security Packages
app.use(helmet());
app.use(cors());
app.use(xss());

//Routers
const authRouter = require("./routers/auth");
const userRouter = require("./routers/userRoutes");
const productRouter = require("./routers/productRouter");
const cartRouter = require("./routers/cartRouter");

// Error Handlers
const notFoundHandler = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 5000;
const start = async() => {
    try {
        const db = await connectDB();
        app.listen(port, console.log("App started in the Port", port));
    } catch (error) {
        console.log(error);
    }
};

start();