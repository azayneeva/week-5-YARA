//event listener to get the name -> make call to router.js

//render DOM functions (2) renderComic() and renderCharacter()

  document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var userInput = document.getElementById("characterInput").value;

    const urlFrontend = "/search/" + userInput;

    getApi(urlFrontend, appendData404, appendData200)
  })


function getApi (url, callback1, callback2) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 & xhr.status == 404) {
      var responseObj = JSON.parse(xhr.responseText);
      callback1(responseObj);
    }
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log(xhr.responseText);
      var responseObj = JSON.parse(xhr.responseText);
      callback2(responseObj);
    }
  }
  xhr.open("GET", url, true);
  xhr.send();
}

function appendData200(responseObj) {
  document.getElementById("character").style.display = 'block'
  document.getElementById("characterName").textContent = responseObj.character.name
  document.getElementById("characterDescription").textContent = responseObj.character.description
  document.getElementById("characterImage").src = responseObj.character.image

  if (responseObj.comic.name.length > 0) {
    document.getElementById("comics").style.display = 'block'
    document.getElementById("comicName").textContent = responseObj.comic.name
    document.getElementById("comicDate").textContent = responseObj.comic.date
    document.getElementById("comicDescription").textContent = responseObj.comic.description
    document.getElementById("comicImage").src = responseObj.comic.image
  }
}

function appendData404(response) {
  document.getElementById("errorMessage").textContent = responseObj.character.description;
  document.getElementById("errorMessage").style.display = 'block'
}
