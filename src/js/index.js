import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { element , renderLoader,clearLoader} from './views/base';
import Recipe from './models/Recipe';

/** Global state of app
 * - search object
 * - current recipe object
 * - shopping list object
 * - Liked recipes
 */
const state = {}; 


/*
Search controller
*/
const controlSearch = async () =>{
    // 1) get query from the view

    const query = searchView.getInput();
    if(query){
        // 2.) New search Object and add to the state
        state.search = new Search(query);

        // 3.) Prepare UI for the result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(element.searchRes);
        
        try{
            // 4.) Search for recipes 

            await state.search.getResult();

            // 5.) render result on UI;
            clearLoader();
            searchView.renderResult(state.search.result);
        }catch(error){
            alert('something went wrong');
            clearLoader();
        }
    }
}


element.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})


element.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt((btn.dataset.goto), 10);
        searchView.clearResults();
        searchView.renderResult(state.search.result, goToPage);
        console.log(goToPage);
    }
})

/*
Recipe controller
*/

const controlRecipe = async () =>{
    const id = window.location.hash.replace('#','');
    console.log(id);
    if(id){
        // prepare UI for change
        renderLoader(element.recipe);
        // create new recipe object
        state.recipe = new Recipe(id);
        
        try{
            // get recipe data and parse ingredient
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            console.log(state.recipe)
            // calculate serving and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            // render recipe 
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch(error){
            alert(error);
        }
    }
}

// window.addEventListener('hashchange',controlRecipe);
// window.addEventListener('load',controlRecipe);

['hashchange','load'].forEach(el => window.addEventListener(el,controlRecipe));