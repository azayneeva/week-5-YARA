//router sends request to correct handler (3)
const handlers = require('./handlers');
const logic  = require('./logic');

function router(req, res) {

  if (req.url === '/' || req.url.includes('/public') ) {

    handlers.loadAssets(req, res);

  } else if (req.url.includes('/search')) {

    logic.init(req, res);

  } else {

    res.writeHead(404, 'Content-Type: text/html');
    res.end('<h1>404 not found</h1>');
  }
}
module.exports = router;
