

//if can't find good match, just go random
var rand = Math.floor((Math.random() * recipes.length));

document.getElementById("title").textContent = recipes[rand].title;
document.getElementById("image").setAttribute("src",recipes[rand].img);
document.getElementById("container").setAttribute("alt",recipes[rand].link);

function openIndex() {
    chrome.tabs.create({active: true, url: recipes[rand].link });
}

document.addEventListener('DOMContentLoaded', function() {
    var y = document.getElementById("container");
    y.addEventListener("click", openIndex);

 });
