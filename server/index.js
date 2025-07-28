require("dotenv").config();
const express = require("express");
const app = express();
require("./db/connection");
const cors = require("cors");
const port = 5002;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json("start server");
});

//user routes
const userAuthRoutes = require("./routes/users/userAuthroutes");
app.use("/userauth/api", userAuthRoutes);

//recipe routes
const recipeRoutes = require("./routes/recipes/recipeAuthRoutes");
app.use("/recipe/api", recipeRoutes);

//start server
app.listen(port, () => {
  console.log(`start server at port number ${port}`);
});
