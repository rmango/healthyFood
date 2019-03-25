
/*//if can't find good match, just go random
var rand = Math.floor((Math.random() * recipes.length));

//document.getElementById("title").textContent = recipes[rand].title;
document.getElementById("image").setAttribute("src", recipes[rand].img);
document.getElementById("container").setAttribute("alt", recipes[rand].link);

function openIndex() {
    chrome.tabs.create({ active: true, url: recipes[rand].link });
}*/





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


function promiseAllFunc(urls) {
    var valToReturn = Promise.all(urls.map(url =>
        fetch(url)
            .then(checkStatus)
            .then(parseJSON)
            .catch(error => console.log("problemo", error))
    ))

    return valToReturn;
}


document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(tabs[0].id, { file: "js/content.js" }, function (data) {
            // Data is an array of values, in case it was executed in multiple tabs/frames
            //set title
            document.getElementById("title").textContent = data[0].substring(0, 20);
            var domString = data[0];

            var ingredients;
            var vegRecipes;
            var ingredToInclude = [];
            //array of meals that have matching ingredients
            var mealMatches = [];

            //read in jsons from theMealDB
            const urls = [
                'https://www.themealdb.com/api/json/v1/1/list.php?i=list',
                'https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian'
            ];

            promiseAllFunc(urls) //reads in list of ingredients and list of vegetarian recipes
                .then(allResponses => {
                    ingredients = allResponses[0];
                    vegRecipes = allResponses[1];
                    //console.log(ingredients);
                    //console.log(vegRecipes);
                    //compare ingredients to words on page
                    for (var i = 0; i < ingredients.meals.length; i++) {
                        var ingredStr = ingredients.meals[i].strIngredient;
                        if (domString.includes(ingredStr)) {
                            //console.log(ingredStr);
                            ingredToInclude.push(ingredStr);
                        }
                    }

                    var urlsToFetch = [];
                    //if there are ingredients on page
                    if (ingredToInclude.length > 0) {
                        console.log("ingredients were found!");


                        //compare recipe ingredients to ingredients found (if recipes exist). select recipe with highest num ingredients in common
                        for (var i = 0; i < vegRecipes.meals.length; i++) {
                            //console.log(vegRecipes.meals[i].strMeal);

                            var mealId = vegRecipes.meals[i].idMeal;
                            var urlToFetch = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + mealId;
                            urlsToFetch.push(urlToFetch);

                            /*const request = async () => {
                                const response = await fetch(urlToFetch);
                                const meal = await response.json();

                                //goes through recipe to count number of matches 
                                //TODO: remove duplicates, ignore case
                                var ingredMatches = 0;//number of matching ingredients found
                                var ingredNum = 1; //index of ingredient
                                nextIngred = eval("meal.meals[0].strIngredient" + ingredNum);
                                while (nextIngred != null && nextIngred != "" && ingredNum < 20) {
                                    //console.log("Ingredient: ", nextIngred);
                                    //if the recipe has an ingredient that was found on the domString
                                    if (ingredToInclude.toString().includes(nextIngred)) {
                                        console.log("MATCH for " + meal.meals[0].idMeal + ":", nextIngred);
                                        ingredMatches++;
                                    }
                                    ingredNum++;
                                    nextIngred = eval("meal.meals[0].strIngredient" + ingredNum);
                                }
                                if (ingredMatches > 0) {
                                    //TODO check for duplicates
                                    mealMatches.push({ "mealId": mealId, "mealName": meal.meals[0].strMeal, "mealImg": meal.meals[0].strMealThumb, "mealVid": meal.meals[0].strYoutube, "numMatches": 1 });
                                    console.log("pushed in " + i + ": ", mealMatches[mealMatches.length - 1]);
                                }
                                console.log("at end of request #", i);
                            }
                            //call to request, getting individual meal json
                            request();
                            console.log("completed request #", i);*/
                        }
                        //get the meal (with matching ingredients) with the most matches
                        //console.log("test", mealMatches);
                        //console.log("test", mealMatches.length);
                        //console.log("test", mealMatches[0].mealId);

                        //document.getElementById("title").textContent = mealMatches[0].mealName;

                        /*if (mealMatches.length > 0) {
                            console.log("meal matches: ", mealMatches[0].mealId);
            
                            var theOne = mealMatches[0];
                            /*var mostMatches = 0;
                            for (var k = 0; k < mealMatches.length; k++) {
                                if (mealMatches[k].numMatches > mostMatches) {
                                    theOne = mealMatches[k];
                                }
                            }
                            console.log("CHOSEN:", theOne);
                            //put null check on chosen
                            //set title
                            document.getElementById("title").textContent = theOne.mealName;
            
                        } else {
                            //go random
                            console.log("randomize itttt");
                        }*/

                    } else {
                        //do random
                        console.log("randomize it");
                    }

                    return promiseAllFunc(urlsToFetch);

                }).then(mealResponses => {
                    console.log("mealResp:", mealResponses);
                })
            console.log("work pls", mealMatches[0]);


            //if all fails, go random
            //if can't find good match, just go random
            /*var rand = Math.floor((Math.random() * recipes.length));

            document.getElementById("title").textContent = recipes[rand].title;
            document.getElementById("image").setAttribute("src", recipes[rand].img);
            document.getElementById("container").setAttribute("alt", recipes[rand].link);*/



        });
    });
    //var y = document.getElementById("container");
    //y.addEventListener("click", openIndex);
});