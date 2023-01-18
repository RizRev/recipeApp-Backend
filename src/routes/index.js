const express = require("express");
const router = express.Router();
const UsersRouter = require("./users");
const RecipeRouter = require("./recipe")

router
    .use("/users",UsersRouter)
    .use("/recipe",RecipeRouter)

module.exports = router;
