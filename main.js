let searchBtn = document.getElementById("search-btn");
let recipesContainer = document.querySelector(".recipes-container");
let recipeCard = document.querySelector(".recipe-card");
let showMoreBtn = document.getElementById("show-more");
let getMealByIdUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
let getMealByNameUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
function get(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = function () {
      resolve(JSON.parse(xhr.responseText));
    };
    xhr.send();
  });
}

function renderRandomMeals() {
  let randomMeal = "https://www.themealdb.com/api/json/v1/1/random.php";
  for (let i = 1; i <= 15; i++) {
    get(randomMeal).then((meal) => {
      let mealCard = `<div class="meal-card" data-id='${meal.meals[0].idMeal}'>
            <img src="${meal.meals[0].strMealThumb}" class="meal-thumbnail">
            <h1 class="meal-name">${meal.meals[0].strMeal}</h1>
            <button class="btn-get-recipe">Get Recipe</button>
        </div>`;
      recipesContainer.innerHTML += mealCard;
    });
  }
}
renderRandomMeals();
showMoreBtn.addEventListener("click", renderRandomMeals);

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-get-recipe")) {
    get(getMealByIdUrl + e.target.parentNode.dataset.id).then((res) => {
      function getIngredientsList() {
        let list = "";
        for (let i = 1; i <= 20; i++) {
          if (res.meals[0][`strIngredient${i}`]) {
            let measure = res.meals[0][`strMeasure${i}`];
            let ingredient = res.meals[0][`strIngredient${i}`];
            list += `<li>${measure}  ${ingredient}</li>`;
          }
        }
        return list;
      }

      document.querySelector(
        ".recipe-card>.inner"
      ).innerHTML = `<h1 class="meal-name">${res.meals[0].strMeal}</h1>
            <div class="category">Category:${res.meals[0].strCategory}</div>
            <div class="area">Area: ${res.meals[0].strArea}</div>
            <div class="ingredients">
                <h1>Ingredients</h1>
                <ol>
                    ${getIngredientsList()}
                </ol>
            </div>
            <div class="instruction">
                <h1>Instruction</h1>
                <p>${res.meals[0].strInstructions}</p>
            </div>
            <div class="video">
                <h1>Video</h1>
                <iframe
                src="https://www.youtube.com/embed/${res.meals[0].strYoutube.slice(
                  -11
                )}">
                </iframe>
            </div>`;
      recipeCard.classList.toggle("hidden");
    });
  }
  if (e.target.classList.contains("close-btn")) {
    recipeCard.classList.toggle("hidden");
  }
});

/*for search function */

let searchBox = document.getElementById("search-box");
let searchResultsContainer = document.getElementById("search-result-container");
function getMealsByName(name) {
  return get(`${getMealByNameUrl}${name}`);
}

function getSearchResults(element) {
  if (element.value) {
    getMealsByName(element.value).then((res) => {
      let listItems = "";
      if (res.meals) {
        res.meals.forEach((meal) => {
          listItems += `<li>${meal.strMeal}</li>`;
        });
        searchResultsContainer.classList.remove("hidden");
        searchResultsContainer.parentElement.style.borderRadius =
          "20px 20px 0px 0px";
        searchResultsContainer.innerHTML = listItems;
      } else {
        searchResultsContainer.innerHTML = "<center>No Result Found!</center>";
      }
    });
  } else {
    searchResultsContainer.classList.add("hidden");
    searchResultsContainer.parentElement.style.borderRadius = "20px";
  }
}
searchBox.addEventListener("input", (e) => {
  getSearchResults(e.target);
});

searchResultsContainer.addEventListener("click", (e) => {
  if ((e.target.tagName = "li")) {
    searchBox.value = e.target.innerText;
    getSearchResults(e.target.parentElement.parentElement.firstElementChild);
  }
});
function search() {
  showMoreBtn.style.display = "none";
  searchResultsContainer.classList.add("hidden");
  searchBox.parentElement.style.borderRadius = "20px";
  recipesContainer.innerHTML = "";
  getMealsByName(searchBox.value).then((res) => {
    res.meals.forEach((meal) => {
      let mealCard = `<div class="meal-card" data-id='${meal.idMeal}'>
            <img src="${meal.strMealThumb}" class="meal-thumbnail">
            <h1 class="meal-name">${meal.strMeal}</h1>
            <button class="btn-get-recipe">Get Recipe</button>
        </div>`;
      recipesContainer.innerHTML += mealCard;
    });
  });
}
searchBox.addEventListener("keydown", (e) => {
  if (
    e.key === "Enter" &&
    searchBox.value &&
    searchResultsContainer.innerText != "No Result Found!"
  ) {
    search();
  }
});
searchBtn.addEventListener("click", () => {
  if (
    searchBox.value &&
    searchResultsContainer.innerText != "No Result Found!"
  ) {
    search();
  }
});
