const fs = require('fs');
const path = require('path');
const request = require('request');
const crypto = require('crypto');
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

module.exports = {
  loadAssets
};
