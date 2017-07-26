//router sends request to correct handler (3)
const handler = require("./handler")

function router(req, res) {

  if (req.url === '/' || req.url.includes('/public') ) {

    handler.loadAssets(req, res);

  } else if (req.url.includes('/search')) {

    handler.getCharacter(req, res);

  } else {

    res.writeHead(404, 'Content-Type: text/html');
    res.end('<h1>404 not found</h1>');
  }
}
module.exports = router;
