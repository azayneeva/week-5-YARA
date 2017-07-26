const test = require('tape');
const shot = require('shot');
const router = require('../src/router.js');

test('Initialise', (t) => {
  let num = 2
  t.equal(num, 2, 'Should return 2');
  t.end();
})

test('Load Assets', (t) => {
  shot.inject(router, {method: 'get', url: '/'}, (res) => {
    t.equal(res.statusCode, 200, 'home route should respond with status code of 200');
    t.end();
  })
})

test('Load Assets', (t) => {
  shot.inject(router, {method: 'get', url: '/public/index.js'}, (res) => {
    t.equal(res.statusCode, 200, 'index.html should respond with status code of 200');
    t.end();
  })
})

test('Load Assets', (t) => {
  shot.inject(router, {method: 'get', url: '/public/../tryingtohackus.js'}, (res) => {
    t.equal(res.statusCode, 400, 'invalid public URLs should respond with status code of 400');
    t.end();
  })
})
