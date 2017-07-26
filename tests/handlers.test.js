const test = require('tape');
const shot = require('shot');
const handlers = require('../src/handlers.js');

test('Initialise', (t) => {
  let num = 2
  t.equal(num, 2, 'Should return 2');
  t.end();
})

test('Load Assets', (t) => {
  shot.inject(handlers, {method: 'get', url: '/'}, (res) => {
    t.equal(res.statusCode, 200, 'should respond with status code of 200');
    t.end();
  })
})
