import React, { useState } from 'react';
import './EditRecipe.scss';
import toast, { LoaderIcon } from 'react-hot-toast';
import { useEditRecipeMutation, useGetRecipeQuery } from '../../redux/features/api/recipe';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const EditRecipe = () => {
  const { id } = useParams();

  const authState = useSelector((state) => state.auth);

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

  const { data: getRecipeData, isLoading: recipeLoading, error: recipeError } = useGetRecipeQuery({ id });
  const [editRecipe, { isLoading, error, data, isSuccess, reset }] = useEditRecipeMutation();

  React.useEffect(() => {
    const error = recipeError;
    if (error)
      toast.error(
        String(
          error?.data?.errorMessage || error?.data?.error || error?.message || 'Get Recipes: Failed to retrieve recipe.'
        )
      );
  }, [recipeError]);

  const recipe = React.useMemo(() => {
    if (getRecipeData?.getSingleRecipe) return getRecipeData.getSingleRecipe;
    return null;
  }, [getRecipeData]);

  React.useEffect(() => {
    if (recipe) {
      setRecipeData({
        name: recipe.recipename,
        description: recipe.description,
        instructions: recipe.instructions,
        cookingTime: recipe.cookingTime,
        ingredients: recipe.ingredients || [''],
      });
    }
  }, [recipe]);

  React.useEffect(() => {
    if (error) {
      toast.error(
        String(
          error?.data?.errorMessage || error?.data?.error || error?.message || 'Update Recipe: Failed to update recipe.'
        )
      );
    }
  }, [error]);

  React.useEffect(() => {
    if (isSuccess && data.updateRecipe._id) {
      reset();
      toast.success('Recipe updated successfully!');
      navigate('/RecipeDetails/' + data.updateRecipe._id);
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
    if (recipeImage) formData.append('recipeImg', recipeImage); // FIXED

    recipeData.ingredients.forEach((ingredient) => {
      formData.append('ingredients[]', ingredient);
    });

    editRecipe({ id, data: formData });
  };

  if (recipeLoading) {
    return (
      <div className="create-recipe-container">
        <h4>Fetching Recipe</h4>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="create-recipe-container">
        <h4>Page Not Found</h4>
      </div>
    );
  }

  if (recipe.userId !== authState.data._id) {
    return <Navigate to={`/RecipeDetails/${id}`} />;
  }

  return (
    <div className="create-recipe-container">
      <h2>Edit Recipe: {recipe.recipename}</h2>
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
            'Save Recipe'
          )}
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;
