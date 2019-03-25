//functions
function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}
function parseJSON(response) {
    return response.json();
}
//for opening link in new tab
function openIndex() {
    chrome.tabs.create({ active: true, url: recipes[rand].link });
}

//fetches jsons from multiple urls, returns array of them
function promiseAllFunc(urls) {
    var valToReturn = Promise.all(urls.map(url =>
        fetch(url)
            .then(checkStatus)
            .then(parseJSON)
            .catch(error => console.log("problemo", error))
    ))
    return valToReturn;
}

function randomizeRecipe() { //need to update for API
    var rand = Math.floor((Math.random() * recipes.length));

    document.getElementById("title").textContent = recipes[rand].title;
    document.getElementById("image").setAttribute("src", recipes[rand].img);
    document.getElementById("container").setAttribute("alt", recipes[rand].link);
}


//when the popup is opened, do everything
document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(tabs[0].id, { file: "js/content.js" }, function (data) {
            // Data is an array of values, in case it was executed in multiple tabs/frames

            //innerHTML of DOM, collected in content script
            var domString = data[0];

            var ingredients; //all possible ingredients
            var vegRecipes; // all possible vegetarian recipes
            var ingredToInclude = []; //ingredients found in DOMString
            var mealMatches = [];//array of meals that have matching ingredients

            //read in jsons from theMealDB
            const urls = [
                'https://www.themealdb.com/api/json/v1/1/list.php?i=list',
                'https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian'
            ];

            promiseAllFunc(urls) //reads in json of ingredients and json of vegetarian recipes
                .then(allResponses => {
                    ingredients = allResponses[0];
                    vegRecipes = allResponses[1];

                    //compare ingredients to words on page, add to array if match
                    for (var i = 0; i < ingredients.meals.length; i++) {
                        var ingredStr = ingredients.meals[i].strIngredient;
                        if (domString.includes(ingredStr)) {
                            ingredToInclude.push(ingredStr);
                        }
                    }

                    var urlsToFetch = []; //urls of meals that have desired ingredients
                    //if there are ingredients on page
                    if (ingredToInclude.length > 0) {
                        console.log("ingredients were found!");

                        //find urls of meals using their ids
                        for (var i = 0; i < vegRecipes.meals.length; i++) {
                            var mealId = vegRecipes.meals[i].idMeal;
                            var urlToFetch = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + mealId;
                            urlsToFetch.push(urlToFetch);
                        }

                    } else {
                        //do random
                        console.log("randomize it"); //TODO all null checks everywhere
                    }

                    //pass the jsons fetched from array of urls into next .then()
                    return promiseAllFunc(urlsToFetch);

                }).then(mealResponses => { //all vegetarian meals
                    console.log("mealResp:", mealResponses);

                    //loop through all vegetarian meals - array of jsons
                    for (var m = 0; m < mealResponses.length; m++) {

                        //goes through recipe to count number of matches 
                        //TODO: remove duplicates, ignore case
                        var ingredMatches = 0;//number of matching ingredients found
                        var ingredNum = 1; //index of ingredient
                        var nextIngred = eval("mealResponses[m].meals[0].strIngredient" + ingredNum);//next ingredient in meal
                        console.log("Ingredient1: ", nextIngred);

                        while (nextIngred != null && nextIngred != "" && ingredNum < 20) {
                            //console.log("Ingredient: ", nextIngred);
                            //if the recipe has an ingredient that was found on the domString
                            if (ingredToInclude.toString().includes(nextIngred)) {
                                console.log("MATCH for " + mealResponses[m].meals[0].idMeal + ":", nextIngred);
                                ingredMatches++;
                            }
                            ingredNum++;
                            nextIngred = eval("mealResponses[m].meals[0].strIngredient" + ingredNum);
                        }
                        if (ingredMatches > 0) {
                            //TODO check for duplicates
                            mealMatches.push({ "meal": mealResponses[m].meals[0], "numMatches": 1 });

                        }
                    }

                    console.log("mealMatches:", mealMatches);
                    document.getElementById("title").textContent = mealMatches[0].meal.strMeal;
                    document.getElementById("image").setAttribute("src", mealMatches[0].meal.strMealThumb);
                    document.getElementById("container").setAttribute("alt", mealMatches[0].meal.strYoutube);//TODO make link work
                })
        });
    });
    var y = document.getElementById("container");
    y.addEventListener("click", y.getAttribute("alt"));
});