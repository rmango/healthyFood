/*chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
    // Note that sending a message to a content script is different
    chrome.tabs.sendMessage(tabs[0].id, {message:'getPageDOM'}, function(response) {
      console.log(response);
      document.getElementById("title").textContent = response;

    });
  });*/

/*
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.msg === "something_completed") {
            //  To do something
            console.log("MESSAGE PASSED!");
        }
    }
);*/


//if can't find good match, just go random
var rand = Math.floor((Math.random() * recipes.length));

//document.getElementById("title").textContent = recipes[rand].title;
document.getElementById("image").setAttribute("src", recipes[rand].img);
document.getElementById("container").setAttribute("alt", recipes[rand].link);

function openIndex() {
    chrome.tabs.create({ active: true, url: recipes[rand].link });
}

document.addEventListener('DOMContentLoaded', function () {
    var y = document.getElementById("container");
    y.addEventListener("click", openIndex);
});


//
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    alert("message received");
    console.log("message rec");
});

var event = document.createEvent('Event');
event.initEvent('hello');
document.dispatchEvent(event);
