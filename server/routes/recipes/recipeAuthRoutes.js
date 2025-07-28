const express = require("express");
const router = new express.Router();
const recipeUpload = require("../../multerConfig/recipeConfig/recipeConfig");
const recipeAuthController = require("../../controllers/recipes/recipeControllers");
const userAuthentication = require("../../middleware/userAuthenticate");

//recipe auth routes
router.post(
  "/create",
  userAuthentication,
  recipeUpload.single("recipeImg"),
  recipeAuthController.createRecipe
);
router.patch(
  "/updaterecipe/:recipeid",
  userAuthentication,
  recipeUpload.single("recipeImg"),
  recipeAuthController.updateRecipe
);
router.delete(
  "/deleterecipe/:recipeid",
  userAuthentication,
  recipeAuthController.deleteRecipe
);
router.get("/singleRecipe/:recipeid",recipeAuthController.getSingleRecipeData)
router.get("/recipeData", recipeAuthController.getRecipeData)

module.exports = router;
