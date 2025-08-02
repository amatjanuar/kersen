const express = require("express");
const productRoutes = require("./routes/productRoutes");
const dotenv = require("dotenv");
const db = require("./config/db");
const categoryControllers = require("./routes/categoryRoutes")
const usersRoutes = require("./routes/usersRoutes")
const authRoutes = require("./routes/authRoutes");
dotenv.config();

const app = express();
app.use(express.json());
app.use("/product", productRoutes);
app.use("/categories", categoryControllers)
app.use("/users", usersRoutes)
app.use("/auth", authRoutes);

app.use("/ping", (req, res) => {
  res.send("api is running");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`port jalan di ${port}`);
});
