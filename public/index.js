//event listener to get the name -> make call to router.js

//render DOM functions (2) renderComic() and renderCharacter()

var userInput = document.getElementById('searchForm');

userInput.addEventListener('submit', function(event) {
  var appendedInput = "/search/" + event.target.value;
  console.log(appendedInput);
  // loadAssets(appendedInput);
  event.preventDefault();
});
