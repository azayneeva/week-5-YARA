//event listener to get the name -> make call to router.js

//render DOM functions (2) renderComic() and renderCharacter()

  document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var userInput = document.getElementById("characterInput").value;

    const urlFrontend = "http://localhost:4000/" + "search/" + userInput;

    getApi(urlFrontend, appendData404, appendData200)
  })


function getApi (url, callback1, callback2) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 & xhr.status == 404) {
      var response = xhr.responseText
      callback1(response);
    }
    if (xhr.readyState == 4 && xhr.status == 200) {
      var responseObj = JSON.parse(xhr.responseText);
      callback2(responseObj);
      console.log(responseObj)
    }
  }
  xhr.open("GET", url, true);
  xhr.send();
}

function appendData200(responseObj) {
  document.getElementById("results").style.display = 'block'
  document.getElementById("characterName").textContent = responseObj[0].name
  document.getElementById("characterDescription").textContent = responseObj[0].description
  document.getElementById("characterImage").src = responseObj[0].thumbnail.path + '.' + responseObj[0].thumbnail.extension

  if (responseObj[1]) {
    document.getElementById("comicResults").style.display = 'block'
    document.getElementById("comicName").textContent = responseObj[1].name
    document.getElementById("comicDate").textContent = responseObj[1].date
    document.getElementById("comicDescription").textContent = responseObj[1].description
    document.getElementById("comicImage").src = responseObj[1].thumbnail.path + '.' + responseObj[1].thumbnail.extension
  }
}

function appendData404(response) {
  document.getElementById("errorMessage").textContent = response
  document.getElementById("errorMessage").style.display = 'block'
}
