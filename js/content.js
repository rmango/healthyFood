//alert("Hello from your extension!");
console.log("I'm running!");

//using TheMealDB
var allText = document.body.innerText;

console.log(allText);



//https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast
var response = {"farewell": "farewell"};

chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
    console.log(response.farewell);
  });