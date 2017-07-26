//event listener to get the name -> make call to router.js

//render DOM functions (2) renderComic() and renderCharacter()

  document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var userInput = document.getElementById("characterInput").value;

    const urlFrontend = "http://localhost:4000/" + "search/" + userInput;

    getApi(urlFrontend, appendData)
  })


function getApi (url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var responseObj = JSON.parse(xhr.responseText);
      callback(responseObj);
    }
  }
  xhr.open("GET", url, true);
  xhr.send();
}

function appendData(responseObj) {
  console.log("im response" + responseObj)
  document.getElementById("results").textContent = responseObj[0].description
  document.getElementById("results").style.display = 'block'
}
