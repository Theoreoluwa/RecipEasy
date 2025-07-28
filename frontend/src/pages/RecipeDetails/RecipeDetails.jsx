import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./RecipeDetails.scss";
import Container from "react-bootstrap/esm/Container";
import Card from "react-bootstrap/Card";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast, { LoaderIcon } from "react-hot-toast";
import {
  useGetRecipeQuery,
  useDeleteRecipeMutation,
} from "../../redux/features/api/recipe";

const RecipeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const authState = useSelector((state) => state.auth);

  const [showFullNote, setShowFullNote] = React.useState(false); // state for show more

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const { data, isLoading, error } = useGetRecipeQuery({ id });
  const [
    deleteRecipe,
    { isLoading: deleteLoading, error: deleteError, isSuccess: deleteSuccess },
  ] = useDeleteRecipeMutation();

  const recipe = React.useMemo(() => {
    if (data?.getSingleRecipe) return data.getSingleRecipe;
    return null;
  }, [data]);

  const handleEdit = () => {
    if (authState.auth && recipe?.userId === authState.data._id) {
      navigate(`/RecipeDetails/${id}/edit`);
    }
  };

  const handleDelete = () => {
    if (authState.auth && recipe?.userId === authState.data._id) {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this recipe?"
      );
      if (confirmDelete) {
        deleteRecipe({ id });
      }
    }
  };

  useEffect(() => {
    if (error)
      toast.error(
        String(
          error?.data?.errorMessage ||
            error?.data?.error ||
            error?.message ||
            "Get Recipes: Failed to retrieve recipe."
        )
      );
  }, [error]);

  useEffect(() => {
    const error = deleteError;
    if (error)
      toast.error(
        String(
          error?.data?.errorMessage ||
            error?.data?.error ||
            error?.message ||
            "Get Recipes: Failed to remove recipe."
        )
      );
  }, [deleteError]);

  useEffect(() => {
    if (deleteSuccess) {
      navigate("/");
    }
  }, [deleteSuccess, navigate]);

  if (isLoading)
    return (
      <Container className="recipe-page">
        <p style={{ textAlign: "center" }}>Fetching Recipe...</p>
      </Container>
    );

  if (!recipe)
    return (
      <Container className="recipe-page">
        <p style={{ textAlign: "center" }}>No recipe found</p>
      </Container>
    );

  return (
    <Container className="recipe-page">
      <div className="main-header" data-aos="fade-down">
        <h1>{recipe.recipename}</h1>
        <div className="meta-info"></div>
        <h4 className="author">
          Recipe by: <span>{recipe.userData?.username || "Anonymous"}</span>
        </h4>
        <h4 className="author">Cooking Time: {recipe.cookingTime} </h4>

        {authState.auth && recipe.userId === authState.data._id && (
          <div className="actions">
            <button
              className="icon-btn edit-btn"
              onClick={handleEdit}
              title="Edit Recipe"
            >
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
            {deleteLoading ? (
              <LoaderIcon />
            ) : (
              <button
                className="icon-btn delete-btn"
                onClick={handleDelete}
                title="Delete Recipe"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="recipe-body">
        <div className="left-panel">
          <Card className="image-card" data-aos="zoom-in">
            <Card.Img
              variant="top"
              src={recipe.recipeImg || "/Recipeasy-logo.png"}
            />
          </Card>

          <Card className="card-section" data-aos="fade-up">
            <Card.Body>
              <h3>Description</h3>
              <p>{recipe.description}</p>
            </Card.Body>
          </Card>

          <Card className="card-section" data-aos="fade-up">
            <Card.Body>
              <h3>Ingredients for making {recipe.recipename}</h3>
              {(recipe.ingredients || []).map((item, index) => (
                <p key={index}>
                  <i className="fa-solid fa-circle circle-icon"></i> {item}
                  {recipe.ingredients.length > 100 && (
                <button
                  className="show-more-btn"
                  onClick={() => setShowFullNote(!showFullNote)}
                >
                  {showFullNote ? "Show Less" : "Show More"}
                </button>
              )}
                </p>
              ))}
            </Card.Body>
          </Card>
        </div>

        <div className="right-panel">
          <Card className="note-card" data-aos="fade-left">
            <Card.Body>
              <div className="note-header">
                <img src="/note.png" alt="Recipeasy" />
                <h3>Cooking Instructions</h3>
              </div>
              <p className={showFullNote ? "full-note" : "short-note"}>
                {recipe.instructions}
              </p>
              {recipe.instructions.length > 200 && (
                <button
                  className="show-more-btn"
                  onClick={() => setShowFullNote(!showFullNote)}
                >
                  {showFullNote ? "Show Less" : "Show More"}
                </button>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default RecipeDetails;

