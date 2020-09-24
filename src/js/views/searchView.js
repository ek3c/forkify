import { element } from './base';

export const getInput = () => element.searchInput.value;

export const clearInput = () => element.searchInput.value = '';

export const clearResults = () => {
    element.searchResList.innerHTML = '';
    element.searchResPages.innerHTML = '';
}

// 'Pasta with tomato and spinach'
// after split = ['Pasta','tomato','and','spinach']
// acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta']
// acc: 5 / acc + cur.length = 11 / newTitle = ['Pasta', 'tomato']
// acc: 11 / acc + cur.length = 14 / newTitle = ['Pasta', 'tomato', 'and']
// acc: 14  / acc + cur.length = 21 / newTitle = ['Pasta', 'tomato','and']

const limitRecipeTitle = (title, limit = 17) =>{
    const newTitle = [];
    if(title.length > limit){
        title.split(' ').reduce((acc,cur) => {
            if(acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length ;
        },0);
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

const renderRecipes = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    element.searchResList.insertAdjacentHTML('beforeend',markup);
};

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if(page === 1 && pages > 1){
        //Only button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages){
        // both button
        button = `
            ${createButton(page, 'prev')};
            ${createButton(page, 'next')};
        `;
    }else if(page === pages && pages > 1){
        // only button to go to prev page
        button = createButton(page, 'prev');
    }
    element.searchResPages.insertAdjacentHTML('afterbegin',button);
};

export const renderResult = (recipes, page = 1, resPerPage = 10) => {

    // render results of current page
    const start = (page - 1) * 10;
    const end = page *resPerPage;
    console.log(recipes);
    recipes.slice(start,end).forEach(renderRecipes);

    // render pagination button
    renderButtons(page,recipes.length,resPerPage);
};

