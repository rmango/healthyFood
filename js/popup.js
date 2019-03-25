
/*//if can't find good match, just go random
var rand = Math.floor((Math.random() * recipes.length));

//document.getElementById("title").textContent = recipes[rand].title;
document.getElementById("image").setAttribute("src", recipes[rand].img);
document.getElementById("container").setAttribute("alt", recipes[rand].link);

function openIndex() {
    chrome.tabs.create({ active: true, url: recipes[rand].link });
}*/

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

            //read in all of the jsons from theMealDB
            const urls = [
                'https://www.themealdb.com/api/json/v1/1/list.php?i=list',
                'https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian'
            ];

            Promise.all(urls.map(url =>
                fetch(url)
                    .then(checkStatus)
                    .then(parseJSON)
                    .catch(error => console.log("problemo", error))
            ))
                .then(allResponses => {
                    ingredients = allResponses[0];
                    vegRecipes = allResponses[1];
                    console.log(ingredients);
                    console.log(vegRecipes);
                    //compare ingredients to words on page
                    for (var i = 0; i < ingredients.meals.length; i++) {
                        var ingredStr = ingredients.meals[i].strIngredient;
                        if (domString.includes(ingredStr)) {
                            console.log(ingredStr);
                            ingredToInclude.push(ingredStr);
                        }
                    }

                    console.log("ingredToInclude:", ingredToInclude);
                    console.log("ingredToInclude:", ingredToInclude.length);

                    //if there are ingredients on page
                    if (ingredToInclude.length > 0) {
                        console.log("ingredients were found!");
                        //compare recipe ingredients to ingredients found (if recipes exist). select recipe with highest num ingredients in common
                        for (var i = 0; i < vegRecipes.meals.length; i++) {
                            console.log(vegRecipes.meals[i].strMeal);

                            //fetch the ingredients for that meal
                            fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772')
                                .then(res => res.json())
                                .then((out) => {
                                    console.log("fetching ingredients for meal:", out);
                                })
                                .catch(err => { throw err });

                        }

                    } else {
                        //do random
                        console.log("randomize it");
                    }


                })





            /*fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
                .then(res => res.json())
                .then((out) => {
                    ingredients = out;
                    console.log("json:", ingredients);


                    //compare ingredients to words on page
                    for (var i = 0; i < ingredients.meals.length; i++) {
                        var ingredStr = ingredients.meals[i].strIngredient;
                        if (domString.includes(ingredStr)) {
                            console.log(ingredStr);
                            ingredToInclude.push(ingredStr);
                        }
                    }
                })
                .catch(err => { throw err });

            console.log("ingredToInclude:", ingredToInclude);
            console.log("ingredToInclude:", ingredToInclude.length);

            //if ingredients were found
           /* if (ingredToInclude != []) {
                console.log("ingredients were found!");

                //get list of vegetarian recipes
                /*fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=Vegetarian')
                    .then(res => res.json())
                    .then((outr) => {
                        var vegRecp = outr;
                        console.log("vegRecp: ", outr);

                        //compare recipe ingredients to ingredients found (if recipes exist). select recipe with highest num ingredients in common
                        var recipeWithIngred;
                        var highestNumIngred = 0;
                        for (var j = 0; j < vegRecp.meals.length; j++) {
                            //lookup meal by id
                            var mealId = vegRecp.meals[0].idMeal;
                            console.log("mealid: ", mealId);
                            /*fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772')
                                .then(res => res.json())
                                .then((outrecp) => {
                                    var recp = outrecp;
                                    var ingredName = recp.meals.strIngredient1;
                                    var k = 1;
                                    while(ingredName != null) {
                                        for(var m = 0; m < ingredToInclude.length; m++) {
                                            //if(ingredToInclude[m].toLowerCase() == ingredName.toLowerCase()) {
                                                console.log("MATCH:",ingredName);
                                            //}
                                        }

                                        ingredName = null;
                                        k++;
                                    }



                                })
                                .catch(err => { throw err });
                        }


                        //if no recipes, go random
                        

                    })
                    .catch(err => { throw err });


            } else {
                //if all fails, go random
                //if can't find good match, just go random
                var rand = Math.floor((Math.random() * recipes.length));

                document.getElementById("title").textContent = recipes[rand].title;
                document.getElementById("image").setAttribute("src", recipes[rand].img);
                document.getElementById("container").setAttribute("alt", recipes[rand].link);
            }*/



        });
    });
    //var y = document.getElementById("container");
    //y.addEventListener("click", openIndex);
});



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