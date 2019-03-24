//alert("Hello from your extension!");
console.log("I'm running!");


//using TheMealDB
var allText = document.body.innerText;

console.log(allText);



//https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast


/*chrome.runtime.sendMessage({message: "hi"}, (response) => {
  console.log(response.message);
});*/

/*chrome.runtime.onMessage(function(message, sender, sendResponse) {
    if (request.message == 'getPageDOM')
      sendResponse("resp");
  });*/

  document.addEventListener("hello", function(data) {
    chrome.runtime.sendMessage("test");
});
