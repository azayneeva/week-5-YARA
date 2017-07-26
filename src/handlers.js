//3 handler functions
//loadAssets() for basic loading
const fs = require('fs');
const path = require('path');

const loadAssets = (req, res) => {
  let accepted = ['/', '/public/index.html', '/public/style.css', '/public/index.js'];
  let url = req.url;

  if (url === '/') {
    url = '/public/index.html'
  };

  if (!accepted.includes(url)) {
    res.writeHead(400, 'Content-Type: text/html');
    res.end('<h1>Sorry, that is not a valid file name</h1>');
  };

  const extension = url.split('.')[1];
  const extensionType = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    ico: 'image/x-icon'
  };

  const filePath = path.join(__dirname, '..', url);

  fs.readFile(filePath, (error, file) => {
    if (error) {
      res.writeHead(500, 'Content-Type: text/html');
      res.end('<h1>Sorry, we\'re having a problem, please try again</h1>');
    } else {
      res.writeHead(200, `Content-Type: ${extensionType[extension]}`);
      res.end(file);
    }
  });
}
//api call function
//getCharacter(name) calls API call using request module, call renderCharacter() and call getComic()
//3 responses: 200 and information in results, renderCharacter with results; 200 and empty results, renderCharacter with 'check your spelling'; other status codes renderCharacter 'sorry we're feeling sleepy - even superheroes need to rest'
//getComic(id) calls API call using request module, call renderComic(): two cases 200 and not 200.
