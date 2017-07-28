const http = require('http');
const router = require('./router');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || '0.0.0.0';

const server = http.createServer(router).listen(port);

console.log(`server is running on localhost:${port}`);
