import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // loading spinner
    recipeView.renderSpinner();

    // 0 update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) updating bookmarks
    bookmarksView.update(model.state.bookmarks);

    // 2)Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    // 1) Get search results
    const query = searchView.getQuery();
    if (!query) return;

    // 2) loading spinner
    resultsView.renderSpinner();

    // 3) Load search results
    await model.loadSearchResults(query);

    // 4) Render Results
    resultsView.render(model.getSearchResultsPage(1));

    // 5) Render initial pageination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // 1) Render new Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render new pageination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe servings (in state)
  model.updateServings(newServings);

  // update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // We can read bookmarked from all recipes, because we added them in the begining (in model.loadRecipe)

  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else if (model.state.recipe.bookmarked) {
    model.deleteBookmark(model.state.recipe.id);
  }

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 2) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Render Spinner
    addRecipeView.renderSpinner();

    // Upload the new Recipe
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Sucess message
    addRecipeView.renderMessage();

    // To change id in url ==> we can use history API
    // window.history is hostpry API of the browser. and we can use pushState() method to change the url without reloading the page
    // pushState() takes 3 arguments. 1st one is state that doesn't matter and we can give null. second one is  title and here doesn't matter we can give empty string, BUT third one is important and that is the 'URL'

    // More info on window.history --> we can use to go back and forth on pages like window.history.back()

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Rerender bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`🎆 ${err.message}`);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('Welcome to the application');
};

const init = function () {
  bookmarksView.addHnadlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};

init();
