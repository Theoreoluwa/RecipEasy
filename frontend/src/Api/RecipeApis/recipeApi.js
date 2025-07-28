// src/Api/RecipeApis/recipeApi.js
import { commonrequest } from "../CommonRequest";
import { BASE_URL } from "../helper";

//logic for create recipe api
export const createRecipeApi = async (data, header) => {
  return await commonrequest(
    "POST",
    `${BASE_URL}/recipe/api/create`,
    data,
    header,
    "user"
  );
};
