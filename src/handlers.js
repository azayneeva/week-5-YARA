//3 handler functions
//loadAssets() for basic loading
const fs = require('fs');
const path = require('path');
const urlBuilder = require('./urlBuilder')
//for API Call function
const request = require('request');
const crypto = require('crypto');

//---------loadAssets function----------//

const loadAssets = (req, res) => {
  let accepted = ['/', '/public/index.html', '/public/style.css', '/public/index.js'];
  let url = req.url;

  if (!accepted.includes(url)) {
    res.writeHead(400, 'Content-Type: text/html');
    res.end('<h1>Sorry, that is not a valid file name</h1>');
    return;
  };

  if (url === '/') {
    url = '/public/index.html'
  };

  const extension = url.split('.')[1];
  const extensionType = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript'
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

//------------ API Call -------------//

// const options = {
//     url: `url`,
//     method: 'GET',
//     headers: {
//         'Accept': 'application/json',
//         'Accept-Charset': 'utf-8',
//     }
// };
//
// request(options, function(err, res, body) {
//     let json = JSON.parse(body);
//     console.log(json);
// });

//-----------getCharacter -------------//

// const API_URL = "https://gateway.marvel.com/v1/public"
// const PRIV_KEY = "218c6b445a390ead9316822b7661a19b0d5adffc"
// const API_KEY = "7759bf69dd03ab99ee7d615925b09299"

const getCharacter = (req, res) => {
  // const queryName = req.url.replace('/search/','')
  // const ts = Date.now()
  // const hash = crypto.createHash('md5').update(ts + PRIV_KEY + API_KEY).digest('hex')
  // const url = `${API_URL}/characters?name=${queryName}&apikey=${API_KEY}&ts=${ts}&hash=${hash}`

  request(url, function(err, response, body) {
    if (err) {
      res.writeHead(500, 'Content-Type: text/html');
      res.end('<h1>Oooops!</h1>')
      return
    }
    const parsed = JSON.parse(body)
    const results = parsed.data.results
    console.log("Im parsed data", results)

    if (!results.length) {
      res.writeHead(404, 'Content-Type: text/html');
      res.end("Oops, seems this hero doesn't exist, please, try again!")
      return
    }

    res.writeHead(200, 'Content-Type: application/json');
    res.end(JSON.stringify(results))
  })
}

//getCharacter(name) calls API call using request module, call renderCharacter() and call getComic()
//3 responses: 200 and information in results, renderCharacter with results; 200 and empty results, renderCharacter with 'check your spelling'; other status codes renderCharacter 'sorry we're feeling sleepy - even superheroes need to rest'
//getComic(id) calls API call using request module, call renderComic(): two cases 200 and not 200.
module.exports = {loadAssets, getCharacter};
