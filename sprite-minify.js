const ss = require('./sprite')

function minifyColor(c) {
  if (c[0] === c[1] && c[2] === c[3] && c[4] === c[5]) return c[0] + c[2] + c[4]
  return c
}

function num(n, defaultN) {
  if (typeof n === 'number') return n
  return defaultN
}

function convertStateCharsToObject(achars) {
  var mid = 18
  return achars.map(ch => {
    var r = { char: ch.char }
    r.x = num(ch.x, mid)
    r.y = num(ch.y, mid)
    r.sx = num(ch.sx, mid)
    r.sy = num(ch.sy, mid)
    r.r = num(ch.r, 0)
    r.sz = num(ch.sz, mid)
    r.mode = num(ch.mode, 0)
    r.c = ch.color || '#555'
    return r
  })
}

function formatSpritesToIndexed(sprites) {
  var sprites0 = []
  var palette = {}
  var chars = {}
  var s0 = convertStateCharsToObject(sprites)
  var palCount = 0
  var charCount = 0
  var i
  for (i = 0; i < s0.length; i += 1) {
    var s1 = Object.assign({}, s0[i])
    var c = s1.c.slice(1)
    if (typeof palette[c] === 'undefined') {
      palette[c] = palCount
      palCount += 1
    }
    s1.c = palette[c]
    if (typeof chars[s1.char] === 'undefined') {
      chars[s1.char] = charCount
      charCount += 1
    }
    s1.char = chars[s1.char]
    sprites0 = sprites0.concat(ss.parse(ss.stringify(s1)))
  }

  var res = {
    sprites: sprites0,
    pals: [],
    chars: []
  }
  var k1
  var pkeys = Object.keys(palette)
  console.warn('pkeys', pkeys)
  for (i = 0; i < pkeys.length; i += 1) {
    k1 = pkeys[i]
    res.pals[palette[k1]] = minifyColor(k1)
  }
  var ckeys = Object.keys(chars)
  for (i = 0; i < ckeys.length; i += 1) {
    k1 = ckeys[i]
    res.chars[chars[k1]] = k1
  }
  // var txt = 'chars:' + JSON.stringify(res.chars) + '\n' +
  //       'pal:' + JSON.stringify(res.pals) + '\n' +
  //       '"' + ss.spriteStringify(res.sprites) + '"'
  // elResultText.value = txt
  return res
}

function minify(sprites) {
  var s1 = formatSpritesToIndexed(sprites)
  return [s1.chars.join(''), s1.pals.join('|'), ss.stringify(s1.sprites)].join(
    '~'
  )
}

module.exports = minify
