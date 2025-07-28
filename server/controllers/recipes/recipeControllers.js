const recipeDB = require('../../models/recipes/recipeModel');
const cloudinary = require('../../Cloudinary/cloudinary');

//create recipe
exports.createRecipe = async (req, res) => {
  const file = req.file ? req.file.path : '';
  const { recipename, recipeImg, description, instructions, ingredients, cookingTime } = req.body;

  //Validate the required fields
  if (!recipename || !description || !ingredients || !cookingTime || !file) {
    return res.status(400).json({ errorMessage: 'All fields are required.' });
  }

  const upload = await cloudinary.uploader.upload(file);

  try {
    const recipeData = new recipeDB({
      userId: req.userId,
      recipename,
      recipeImg,
      description,
      instructions,
      ingredients,
      cookingTime,
      recipeImg: upload.secure_url,
    });

    await recipeData.save();
    res.status(200).json({ message: 'Recipe created successfully!', recipeData });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ errorMessage: 'Unable to create recipe, try again', error });
  }
};

//update recipe
exports.updateRecipe = async (req, res) => {
  const { recipeid } = req.params;
  const file = req.file ? req.file.path : '';
  const { recipename, recipeImg, description, instructions, ingredients, cookingTime } = req.body;

  var upload;

  if (file) {
    upload = await cloudinary.uploader.upload(file);
  }

  try {
    const updateRecipe = await recipeDB.findByIdAndUpdate(
      { _id: recipeid },
      {
        recipename,
        recipeImg,
        description,
        instructions,
        ingredients,
        cookingTime,
        recipeImg: upload && upload.secure_url,
      },
      { new: true }
    );

    await updateRecipe.save();
    res.status(200).json({ message: 'Recipe updated successfully!', updateRecipe });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ errorMessage: 'Unable to update recipe, try again', error });
  }
};

//delete recipe
exports.deleteRecipe = async (req, res) => {
  const { recipeid } = req.params;

  try {
    const deleteRecipe = await recipeDB.findByIdAndDelete({ _id: recipeid });
    res.status(200).json({ message: 'Recipe deleted successfully!', deleteRecipe });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ errorMessage: 'Unable to delete recipe, try again', error });
  }
};

//get single recipe data
exports.getSingleRecipeData = async (req, res) => {
  const { recipeid } = req.params;

  try {
    const data = await recipeDB
      .findOne({
        _id: recipeid,
      })
      .populate('userId');

    if (data && data.userId) {
      // Copy populated userId into a new field called userData
      const result = {
        ...data.toObject(),
        userData: data.userId, // populated user
        userId: data.userId._id, // restore original ID
      };

      res.status(200).json({ getSingleRecipe: result });
    } else res.status(404).json({ errorMessage: 'No Recipe Found' });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ errorMessage: error });
  }
};

//get recipe data
exports.getRecipeData = async (req, res) => {
  const { page, search } = req.query;
  const pageNum = page || 1;
  const searchValue = search || '';
  const ITEM_PER_PAGE = 9;

  const query = {
    $or: [
      { recipename: { $regex: searchValue, $options: 'i' } },
      { ingredients: { $elemMatch: { $regex: searchValue, $options: 'i' } } },
    ],
  };

  try {
    const skip = (pageNum - 1) * ITEM_PER_PAGE; //0 * 4 = 4

    //number of recipe count
    const count = await recipeDB.countDocuments(query);

    //page count
    const pageCount = Math.ceil(count / ITEM_PER_PAGE); // 9 / 4 = 2

    const allRecipeData = await recipeDB.aggregate([
      {
        $match: query,
      },
      {
        $skip: skip,
      },
      {
        $limit: ITEM_PER_PAGE,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userData',
        },
      },
    ]);
    res.status(200).json({
      allRecipeData,
      Pagination: {
        totalRecipeCount: count,
        pageCount,
      },
    });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ errorMessage: error });
  }
};
