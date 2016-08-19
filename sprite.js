
// Compile a sprite to and from an object
//
// Limitations:
//
// * All sizes are max. 35
// * Everything is an int
//
// TODO space at a numerical position == 0
// TODO Make each frame a string of 9 bytes for simplicity for now
//      Later this can be compressed further, but get things working!
// TODO Opacity
// TODO Make it possible to use different modes: additive, exclusion + ...
// TODO interpret 4 and 8 chars as alpha color and 1 char as greyscale
// TODO Scale 0-35 to be (-17 - 18) / divisor range
// TODO Decouple
//
// colors are an index innto a color array

var goldenRatio = (1 + Math.sqrt(5)) / 2

// Generate #xxxxxx color strings where each of RGB in the range [min;max]
// XXX deprecate
function newColor (num, min, max) {
  max = max || 0x99
  min = min || 0xDD

  var result = ''
  var range = max - min

  for (var i = 1; i < 4; i += 1) {
    var n = i * num * goldenRatio
    var v = n - (n | 0)
    var s = (i * i ^ (v * range + min) | 0).toString(16)

    if (s.length < 2) s = '0' + s
    result += s
  }
  return result
}

var spritePalette = [ 'FFF', 'F0F' ]

for (var i = 0; i < 35; i += 1) spritePalette.push(newColor(i))

// Characters integers
function intOfChar (ch, defaultValue) {
  return (ch === ' ') ? defaultValue : parseInt(ch, 36)
}

function intToChar (int, prev) {
  if (typeof int !== 'number') int = prev
  return (int === prev) ? ' ' : int.toString(36)
}

var modes = {
  stroke: '-',
  fill: ' '
}
function spriteStringifyOne (o, prev) {
  return [
    // (!o.char || o.char === prev.char) ? ' ' : o.char,
    intToChar(o.char, prev.char),
    intToChar(o.x, prev.x),
    intToChar(o.y, prev.y),
    intToChar(o.color, prev.color),
    intToChar(o.size, prev.size),
    intToChar(o.rot, prev.rot),
    intToChar(o.scaleX, prev.scaleX),
    intToChar(o.scaleY, prev.scaleY),
    intToChar(o.mode, prev.mode)
  ].join('')
}

function spriteStringify (ss) {
  if (!Array.isArray(ss)) ss = [ss]
  if (!ss[0]) return
  var res = [spriteStringifyOne(ss[0], {})]
  for (var i = 1; i < ss.length; i += 1) {
    var s1 = ss[i]
    res.push(spriteStringifyOne(s1, ss[i - 1]))
  }
  res = res.join('')
  return res
}

console.warn('WW', '"' + spriteStringify([
  {
    char: 12,
    color: 1
  },
  {
    char: 12,
    color: 2
  }
]) + '"')

function spriteParseOne (str, prev) {
  var result = {}
  result.char = intOfChar(str[0], prev.char)
  result.x = intOfChar(str[1], prev.x || 0, 36)
  result.y = intOfChar(str[2], prev.y || 0, 36)
  result.color = intOfChar(str[3], prev.color || 0, 36)
  result.size = intOfChar(str[4], prev.size || 64, 36)
  result.rot = intOfChar(str[5], prev.rot || 0, 36)
  result.scaleX = intOfChar(str[6], prev.scaleX || 1, 36)
  result.scaleY = intOfChar(str[7], prev.scaleY || 1, 36)
  result.mode = str[8]
    ? (str[8] === '-' ? 'stroke' : 'fill')
    : (prev.mode || 'fill')
  return result
}

function splitAt (str, length) {
  console.warn('XX', str)
  assert(str.length % length === 0, 'Multiplum')
  var res = []
  while (str.length > 0) {
    res.push(str.substr(0, length))
    str = str.substr(length)
  }
  return res
}

// parse all sprite strings into an array of objects
function spriteParse (ss) {
  if (!Array.isArray(ss)) ss = splitAt(ss, 9)
  var res = [spriteParseOne(ss[0], {})]
  for (var i = 1; i < ss.length; i += 1) {
    res.push(spriteParseOne(ss[i], res[i - 1]))
  }
  console.warn('parsed', res)
  return res
}

// Scale values in obj by divisor and set the values to ge between
// [-17; 18].  For example if divisor is 3 each of the range of 35 steps would
// be of value 35 / 3 ~= 11, i.e. [-5, 6]
function scale (obj, divisor) {
  var res = {}
  res.char = obj.char
  res.color = obj.color
  res.size = obj.size
  res.rot = obj.rot
  res.mode = obj.mode
  res.x = (obj.x - 17) / divisor
  res.y = (obj.y - 17) / divisor
  rex.scaleX = (obj.scaleX - 17) / divisor
  rex.scaleY = (obj.scaleY - 17) / divisor
  return res
}

// This is included in the client

/**
 * @param ctx The 2d canvas context
 * @param ss  An Array of sprite objects
 * @param cs  An array of chars to be index
 * @param ps  Palette array of colors
 * @param x   x coordinate where to print the sprite
 * @param y   y coordinate to printthe sprite at
 */
function spritePaint (ctx, cs, ps, ss, x, y) {
  if (!Array.isArray(ss)) ss = [ss]
  ss = ss.map(function (s) {
    if (typeof s === 'string') return spriteParseOne(s)
    return s
  })
  ctx.save()
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  for (var i = 0; i < ss.length; i += 1) {
    var o = ss[i]
    o.x = o.x - 18
    o.y = o.y - 18
    o.scaleX = (o.scaleX - 18) / 3
    o.scaleY = (o.scaleY - 18) / 3
    var tx = (o.x + x) / 3
    var ty = (o.y + y) / 3
    tx /= o.scaleX
    ty /= o.scaleY
    ctx.save()
    ctx.scale(o.scaleX , o.scaleY)
    ctx.font = o.size + 'px arial'
    if (o.rot) {
      ctx.translate(tx, ty)
      ctx.rotate((Math.PI / 180) * (360 / 36) * o.rot)
      ctx.translate(-tx, -ty)
    }
    // @dev
    // ctx.save()
    // ctx.fillStyle = '#111'
    // ctx.fillRect(tx, ty, 4 / o.scaleX || 1, 4 / o.scaleY || 1)
    // ctx.restore()
    // @end

    // XXX mode is fixed and borked
    // ctx[o.mode + 'Style'] = '#' + ps[o.color]
    // ctx[o.mode + 'Text'](cs[o.char], tx, ty)
    ctx['fillStyle'] = '#' + ps[o.color]
    ctx['fillText'](cs[o.char], tx, ty)
    ctx.restore()
  }
  ctx.restore()
}

function showPalette (ctx, x, y) {
  var dy = 0
  ctx.save()
  spritePalette.forEach(function (color) {
    ctx.fillStyle = '#' + color
    ctx.fillRect(x, y + dy, 40, 20)
    dy += 20
  })
  ctx.restore()
}

if (typeof module !== 'undefined') {
  module.exports = {
    stringify: spriteStringify,
    parse: spriteParse,
    colors: spritePalette
  }
}

function assert (condition, err) {
  if (!condition) throw new Error(err || "Bad")
}

