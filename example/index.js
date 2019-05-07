/**
 * Module Dependencies
 */

var Statistics = require('../')
var bytes = require('bytes')
var Koa = require('koa')
var ms = require('ms')

var app = new Koa();

var stats = Statistics(marker, reduce)

// things to track
function marker () {
  return {
    time: new Date(),
    memory: process.memoryUsage().rss
  }
}

// Note: I don't actually think i'm doing memory right here,
// since sometimes it's negative :-P
function reduce (name, a, b, c, d) {
  if (c && d) {
    var memory = (b.memory - a.memory) + (d.memory - c.memory)
    var time = (b.time - a.time) + (d.time - c.time)
  } else {
    var memory = b.memory - a.memory
    var time = b.time - a.time
  }
  console.log('%s - time: %s memory: %s', name, ms(time), bytes(memory));
}

app.use(stats(async function find_user (ctx, next) {
  await wait(3500)
  await next()
  await wait(500)
}))

app.use(stats(async function render (ctx, next) {
  await wait(1000)
  ctx.body = 'hi there!'
  await wait(2000)
}))

function wait (ms) {
  return new Promise(res => setTimeout(res, ms))
}

app.listen(5000);
