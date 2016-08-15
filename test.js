#!/usr/bin/env node

var test = require('tape')
var sprite = require('./sprite')

test('sprite.stringify', (t) => {
  t.plan(sprites1.length)
  sprites1.forEach((s) => {
    var s1 = sprite.stringify(s)
    t.equal(s1.length, 9)
    console.warn('"' + s1 + '"')
  })
})

test('sprite.parse', (t) => {
  var parsed = sprite.stringify(sprites1)
  var objs = sprite.parse(parsed.split('|'))
  console.warn(parsed)
  console.warn(objs)
})

var sprites1 = [
  {
    char: 'x',
    color: 12,
    scaleY: 12
  },
  {
    char: '♫',
    size: 35,
    rot: 32,
    x: 12,
    color: 5
  },
  {
    x: 18,
    y: 11,
    mode: 'stroke'
  }
]
