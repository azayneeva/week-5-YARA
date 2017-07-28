  document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var userInput = document.getElementById("characterInput").value;
    if (userInput){
    const urlFrontend = "/search/" + userInput;

    getApi(urlFrontend, appendData404, appendData200)}
  })


  function getApi(url, callback1, callback2) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 & xhr.status == 404) {
        var responseObj = JSON.parse(xhr.responseText);
        callback1(responseObj);
      }
      if (xhr.readyState == 4 && xhr.status == 200) {
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

  function appendData404(responseObj) {
    document.getElementById("character").style.display = 'block'
    document.getElementById("characterImage").src = responseObj.character.image;
    document.getElementById("characterName").textContent = responseObj.character.name;
    document.getElementById("characterDescription").textContent = responseObj.character.description
  }
