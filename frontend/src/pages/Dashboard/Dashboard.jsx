import React from "react";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Dashboard.scss";
import { useNavigate } from "react-router-dom";
import { useGetRecipesQuery } from "../../redux/features/api/recipe";
import useDebounce from "../../hooks/use-debounce";
import useSearchParams from "../../hooks/use-search-params";

const Dashboard = () => {
  const [searchInput, setSearchInput] = React.useState("");

  const [totalPages, setTotalPages] = React.useState(1);
  const [showFullNote, setShowFullNote] = React.useState(false);

  const searchParams = useSearchParams();
  const navigate = useNavigate();
  const deferredSearch = useDebounce(searchInput);

  const currentPage = searchParams.get("currentPage") || 1;
  const search = searchParams.get("search") || "";

  const { data, isLoading, error } = useGetRecipesQuery({
    page: currentPage,
    search,
  });

  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  React.useEffect(() => {
    searchParams.set("search", deferredSearch);
  }, [deferredSearch, searchParams]);

  React.useEffect(() => {
    if (error)
      toast.error(
        String(
          error?.data?.errorMessage ||
            error?.data?.error ||
            error?.message ||
            "Get Recipes: Failed to retrieve recipes."
        )
      );
  }, [error]);

  React.useEffect(() => {
    if (data?.Pagination) {
      setTotalPages(data.Pagination.pageCount);
    }
  }, [data]);

  const handleNavigateRecipe = (id) => {
    navigate(`/RecipeDetails/${id}`);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) searchParams.set("currentPage", currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages)
      searchParams.set("currentPage", currentPage + 1);
  };

  return (
    <Container className="dashboard">
      <h1 className="text-center mt-5 heading" data-aos="fade-down">
        Explore Recipes on <span>RecipEasy</span>
      </h1>

      {/* Search Section */}
      <div
        className="search-wrapper d-flex justify-content-center mb-4"
        data-aos="fade-up"
      >
        <Form className="search-bar">
          <Form.Group className="position-relative" controlId="searchInput">
            <Form.Control
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search Recipes..."
            />
            <i className="fa fa-search search-icon"></i>
          </Form.Group>
        </Form>
      </div>

      {/* Recipe Grid */}
      {isLoading ? (
        <div className="row justify-content-center">
          <p style={{ textAlign: "center" }}>
            Retrieving your Favorite Recipes...
          </p>
        </div>
      ) : data?.allRecipeData?.length > 0 ? (
        <section className="recipecard row justify-content-center">
          {data.allRecipeData.map((recipe, index) => (
            <Card
              key={index}
              className="recipe-card col-12 col-sm-8 col-md-8 col-lg-3"
              data-aos="zoom-in"
            >
              <Card.Img
                variant="top"
                src={recipe.recipeImg}
                className="recipe-img"
              />
              <Card.Body>
                <Card.Title>{recipe.recipename}</Card.Title>
                <Card.Text
                  className={showFullNote ? "full-note" : "short-note"}
                >
                  {recipe.description}
                </Card.Text>
                {recipe.description.length > 100 && (
                  <button
                    className="show-more-btn"
                    onClick={() => setShowFullNote(!showFullNote)}
                  >
                    {showFullNote ? "Show Less" : "Show More"}
                  </button>
                )}
                <Button
                  style={{color:"d54215"}}
                  variant="outline-primary"
                  className="w-100"
                  onClick={() => handleNavigateRecipe(recipe._id)}
                >
                  View Recipe
                </Button>
              </Card.Body>
            </Card>
          ))}
        </section>
      ) : (
        <p style={{ textAlign: "center" }}>No recipe data retrieved</p>
      )}

      {/* Pagination */}
      <div className="pagination-wrapper">
        <Button
          variant="outline-secondary"
          className="pagination-btn"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          &laquo; Prev
        </Button>

        <div className="pagination-info">
          Page {currentPage} of {totalPages}
        </div>

        <Button
          variant="outline-secondary"
          className="pagination-btn"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next &raquo;
        </Button>
      </div>
    </Container>
  );
};

export default Dashboard;
