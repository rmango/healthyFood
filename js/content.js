//alert("Hello from your extension!");
console.log("I'm running!");

//using TheMealDB
var allText = document.body.innerText;

console.log(allText);

//list of all ingredients
//https://www.themealdb.com/api/json/v1/1/list.php?i=list

//https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast
/*var response = {"farewell": "farewell"};

chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
    console.log(response.farewell);
  });*/
  DOMtoString(document); // This will be the last executed statement

  function DOMtoString(document_root) {
      console.log(document_root.body.innerText);
      return document_root.body.innerText;
  }