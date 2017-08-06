/**
* @param {string} ch
* @param {number} defaultValue
* @return {number}
*/
function intOfChar(ch, defaultValue) {
  return ch === ' ' ? defaultValue : parseInt(ch, 36)
}

/**
 * @param {string} str
 * @param {Object|undefined} prev
 * @return {Object}
 */
function spriteParseOne(str, prev) {
  var result = {}
  result.char = intOfChar(str[0], prev.char)
  result.x = intOfChar(str[1], prev.x || 0)
  result.y = intOfChar(str[2], prev.y || 0)
  result.c = intOfChar(str[3], prev.c || 0)
  result.sz = intOfChar(str[4], prev.sz || 18)
  result.r = intOfChar(str[5], prev.r || 0)
  result.sx = intOfChar(str[6], prev.sx || 1)
  result.sy = intOfChar(str[7], prev.sy || 1)
  result.mode = intOfChar(str[8], prev.mode || 0)
  result.paint = result.mode === 1 ? 'stroke' : 'fill'
  return result
}

/**
 * @param {string} str
 * @param {number} length
 * @return {Array<string>}
 */
function splitAt(str, length) {
  var res = []
  while (str.length > 0) {
    res.push(str.substr(0, length))
    str = str.substr(length)
  }
  return res
}

/**
 * @brief  parse all sprite strings into an array of objects
 *
 * @param {string} ss
 * @return {Array<Object>}
 */
function spriteParse(ss) {
  var ss1 = splitAt(ss, 9)
  var res = [spriteParseOne(ss1[0], {})]
  for (var i = 1; i < ss1.length; i += 1) {
    res.push(spriteParseOne(ss1[i], res[i - 1]))
  }
  return res
}

/**
 * @export
 */
class Fut {
  /**
  * @param {string} chars
  * @param {Array<string>} pal
  * @param {string} vars
  */
  constructor(chars, pal, vars) {
    this.chars = chars
    this.pal = pal
    this.v = spriteParse(vars)
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x
   * @param {number} y
   */
  paint(ctx, x, y) {
    ctx.save()
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    for (var i = 0; i < this.v.length; i += 1) {
      var o = this.v[i]
      var ox = o.x - 18
      var oy = o.y - 18
      // Scale up to 4,5 the original size
      var sx = (o.sx - 17) / 4
      var sy = (o.sy - 17) / 4
      var tx = (ox + x) / sx
      var ty = (oy + y) / sy
      ctx.save()
      ctx.font = o.sz + 'px arial'
      ctx.scale(sx, sy)
      // Rotate
      ctx.translate(tx, ty)
      ctx.rotate(Math.PI / 180 * (360 / 36) * o.r)
      ctx.translate(-tx, -ty)
      ctx[o.mode + 'Style'] = '#' + this.pal[o.c].slice(0, 6)
      ctx[o.mode + 'Text'](this.chars[o.char], tx, ty)
      ctx.restore()
    }
    ctx.restore()
  }
}

/**
 * @brief itoString(36)
 *
 * @param {number} int
 * @param {number} prev
 * @return {string}
 */
function intToChar(int, prev) {
  if (typeof int !== 'number') int = prev
  return int === prev ? ' ' : int.toString(36)
}

;(typeof window === 'undefined' ? module['exports'] : window)['Fut'] = Fut
