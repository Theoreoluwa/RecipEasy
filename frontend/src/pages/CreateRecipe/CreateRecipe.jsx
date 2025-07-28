import React, { useState } from 'react';
import './CreateRecipe.scss';
import toast, { LoaderIcon } from 'react-hot-toast';
import { useCreateRecipeMutation } from '../../redux/features/api/recipe';
import { useNavigate } from 'react-router-dom';

const CreateRecipe = () => {
  const [recipeData, setRecipeData] = useState({
    name: '',
    description: '',
    instructions: '',
    cookingTime: '',
    ingredients: [''],
  });

  const [recipeImage, setRecipeImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipeData({
      ...recipeData,
      [name]: value,
    });
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipeData.ingredients];
    newIngredients[index] = value;
    setRecipeData({ ...recipeData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setRecipeData({
      ...recipeData,
      ingredients: [...recipeData.ingredients, ''],
    });
  };

  const removeIngredient = (index) => {
    const newIngredients = [...recipeData.ingredients];
    newIngredients.splice(index, 1);
    setRecipeData({ ...recipeData, ingredients: newIngredients });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRecipeImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      toast.error('No file selected.');
    }
  };

  const [createRecipe, { isLoading, error, data, isSuccess, reset }] = useCreateRecipeMutation();

  React.useEffect(() => {
    if (error) {
      toast.error(
        String(
          error?.data?.errorMessage || error?.data?.error || error?.message || 'Create Recipe: Failed to create recipe.'
        )
      );
    }
  }, [error]);

  React.useEffect(() => {
    if (isSuccess && data.recipeData._id) {
      reset();
      toast.success('Recipe created successfully!');
      navigate('/RecipeDetails/' + data.recipeData._id);
    }
  }, [isSuccess, navigate, data, reset]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (
      !recipeData.name ||
      !recipeData.description ||
      !recipeData.instructions ||
      !recipeData.cookingTime ||
      !recipeImage ||
      recipeData.ingredients.length === 0
    ) {
      toast.error('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('recipename', recipeData.name); // FIXED
    formData.append('description', recipeData.description);
    formData.append('instructions', recipeData.instructions);
    formData.append('cookingTime', recipeData.cookingTime);
    formData.append('recipeImg', recipeImage); // FIXED

    recipeData.ingredients.forEach((ingredient) => {
      formData.append('ingredients[]', ingredient);
    });

    createRecipe(formData);
  };

  return (
    <div className="create-recipe-container">
      <h2>Create a New Recipe</h2>
      <form onSubmit={handleSubmit} className="fade-in">
        <input type="text" name="name" placeholder="Recipe Name" value={recipeData.name} onChange={handleChange} />

        <textarea
          name="description"
          placeholder="Short Description"
          value={recipeData.description}
          onChange={handleChange}
        />

        <input type="file" name="recipeImg" onChange={handleImageChange} accept=".jpeg,.jpg,.png" />

        {preview && <img src={preview} alt="preview" className="preview-img" />}

        <textarea
          name="instructions"
          placeholder="Cooking Instructions"
          value={recipeData.instructions}
          onChange={handleChange}
        />

        <input
          type="text"
          name="cookingTime"
          placeholder="Cooking Time (e.g., 30 mins)"
          value={recipeData.cookingTime}
          onChange={handleChange}
        />

        <div className="ingredients">
          <label>Ingredients:</label>
          {recipeData.ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-input">
              <input
                type="text"
                value={ingredient || ''}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                placeholder={`Ingredient ${index + 1}`}
              />
              {index > 0 && (
                <button type="button" onClick={() => removeIngredient(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addIngredient}>
            + Add Ingredient
          </button>
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <LoaderIcon />
            </div>
          ) : (
            'Create Recipe'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateRecipe;
