import {
  isUnd,
  isBool,
  isNum,
  isBigInt,
  isSym,
  isStr,
  isFn,
  isObj,
  prototypeChainHasOwn
} from './util'

describe('Util', () => {

  it('exports function `isUnd`', () => {
    expect(isUnd).toEqual(expect.any(Function))
  })

  it('exports function `isBool`', () => {
    expect(isBool).toEqual(expect.any(Function))
  })

  it('exports function `isNum`', () => {
    expect(isNum).toEqual(expect.any(Function))
  })

  it('exports function `isBigInt`', () => {
    expect(isBigInt).toEqual(expect.any(Function))
  })

  it('exports function `isStr`', () => {
    expect(isStr).toEqual(expect.any(Function))
  })

  it('exports function `isSym`', () => {
    expect(isSym).toEqual(expect.any(Function))
  })

  it('exports function `isFn`', () => {
    expect(isFn).toEqual(expect.any(Function))
  })

  it('exports function `isObj`', () => {
    expect(isObj).toEqual(expect.any(Function))
  })

  describe('isUnd()', () => {

    it('returns `true` when value is `undefined`', () => {
      expect(isUnd(void 0)).toBe(true)
    })

    it('returns `false` when value is not `undefined`', () => {
      expect(isUnd(() => {})).toBe(false)
      expect(isUnd({})).toBe(false)
      expect(isUnd('test')).toBe(false)
      expect(isUnd(0)).toBe(false)
      expect(isUnd(1n)).toBe(false)
      expect(isUnd(true)).toBe(false)
      expect(isUnd(Symbol())).toBe(false)
      expect(isUnd(null)).toBe(false)
    })

  })

  describe('isBool()', () => {

    it('returns `true` when value is boolean', () => {
      expect(isBool(true)).toBe(true)
      expect(isBool(false)).toBe(true)
    })

    it('returns `false` when value is not boolean', () => {
      expect(isBool(() => {})).toBe(false)
      expect(isBool({})).toBe(false)
      expect(isBool('test')).toBe(false)
      expect(isBool(0)).toBe(false)
      expect(isBool(1n)).toBe(false)
      expect(isBool(void 0)).toBe(false)
      expect(isBool(Symbol())).toBe(false)
      expect(isBool(null)).toBe(false)
    })

  })

  describe('isNum()', () => {

    it('returns `true` when value is a number', () => {
      expect(isNum(0)).toBe(true)
    })

    it('returns `false` when value is not a number', () => {
      expect(isNum(() => {})).toBe(false)
      expect(isNum({})).toBe(false)
      expect(isNum('test')).toBe(false)
      expect(isNum(true)).toBe(false)
      expect(isNum(1n)).toBe(false)
      expect(isNum(void 0)).toBe(false)
      expect(isNum(Symbol())).toBe(false)
      expect(isNum(null)).toBe(false)
    })

  })

  describe('isBigInt()', () => {

    it('returns `true` when value is a bigint', () => {
      expect(isBigInt(0n)).toBe(true)
    })

    it('returns `false` when value is not a bigint', () => {
      expect(isBigInt(() => {})).toBe(false)
      expect(isBigInt({})).toBe(false)
      expect(isBigInt('test')).toBe(false)
      expect(isBigInt(true)).toBe(false)
      expect(isBigInt(1)).toBe(false)
      expect(isBigInt(void 0)).toBe(false)
      expect(isBigInt(Symbol())).toBe(false)
      expect(isBigInt(null)).toBe(false)
    })

  })

  describe('isStr()', () => {

    it('returns `true` when value is a string', () => {
      expect(isStr('')).toBe(true)
    })

    it('returns `false` when value is not a string', () => {
      expect(isStr(() => {})).toBe(false)
      expect(isStr({})).toBe(false)
      expect(isStr(1n)).toBe(false)
      expect(isStr(true)).toBe(false)
      expect(isStr(1)).toBe(false)
      expect(isStr(void 0)).toBe(false)
      expect(isStr(Symbol())).toBe(false)
      expect(isStr(null)).toBe(false)
    })

  })

  describe('isSym()', () => {

    it('returns `true` when value is a symbol', () => {
      expect(isSym(Symbol())).toBe(true)
    })

    it('returns `false` when value is not a symbol', () => {
      expect(isSym(() => {})).toBe(false)
      expect(isSym({})).toBe(false)
      expect(isSym(1n)).toBe(false)
      expect(isSym(true)).toBe(false)
      expect(isSym(1)).toBe(false)
      expect(isSym(void 0)).toBe(false)
      expect(isSym('test')).toBe(false)
      expect(isSym(null)).toBe(false)
    })

  })

  describe('isFn()', () => {

    it('returns `true` when value is a function', () => {
      expect(isFn(() => {})).toBe(true)
    })

    it('returns `false` when value is not a function', () => {
      expect(isFn({})).toBe(false)
      expect(isFn(1n)).toBe(false)
      expect(isFn(true)).toBe(false)
      expect(isFn(1)).toBe(false)
      expect(isFn(void 0)).toBe(false)
      expect(isFn('test')).toBe(false)
      expect(isFn(Symbol())).toBe(false)
      expect(isFn(null)).toBe(false)
    })

  })

  describe('isObj()', () => {

    it('returns `true` when value is a object', () => {
      expect(isObj({})).toBe(true)
      expect(isObj(null)).toBe(true)
    })

    it('returns `false` when value is not a object', () => {
      expect(isObj(() => {})).toBe(false)
      expect(isObj(1n)).toBe(false)
      expect(isObj(true)).toBe(false)
      expect(isObj(1)).toBe(false)
      expect(isObj(void 0)).toBe(false)
      expect(isObj('test')).toBe(false)
      expect(isObj(Symbol())).toBe(false)
    })

  })

  describe('prototypeChainHasOwn()', () => {

    it('returns `null` for non-objects', () => {
      expect(prototypeChainHasOwn('test')).toBe(null)
      expect(prototypeChainHasOwn(0)).toBe(null)
      expect(prototypeChainHasOwn(1n)).toBe(null)
      expect(prototypeChainHasOwn(true)).toBe(null)
      expect(prototypeChainHasOwn(void 0)).toBe(null)
      expect(prototypeChainHasOwn(null)).toBe(null)
      expect(prototypeChainHasOwn(Symbol())).toBe(null)
    })

    it('returns `null` for props other than strings and symbols', () => {
      expect(prototypeChainHasOwn({}, 0)).toBe(null)
      expect(prototypeChainHasOwn({}, 1n)).toBe(null)
      expect(prototypeChainHasOwn({}, true)).toBe(null)
      expect(prototypeChainHasOwn({}, void 0)).toBe(null)
      expect(prototypeChainHasOwn({}, null)).toBe(null)
    })

    it('returns `null` for non-existing props', () => {
      expect(prototypeChainHasOwn({}, 'test')).toBe(null)
      expect(prototypeChainHasOwn({}, Symbol('test'))).toBe(null)
    })

    it('returns correct `.prototype` object', () => {
      const f1 = function() {}
      const f2 = function() {}
      const f3 = function() {}

      f1.prototype.key1 = {}
      f2.prototype.key2 = {}
      f3.prototype.key3 = {}
      Object.setPrototypeOf(f2, f1)
      Object.setPrototypeOf(f3, f2)

      expect(prototypeChainHasOwn(f3, 'key1').key1).toBe(f1.prototype.key1)
      expect(prototypeChainHasOwn(f3, 'key2').key2).toBe(f2.prototype.key2)
      expect(prototypeChainHasOwn(f3, 'key3').key3).toBe(f3.prototype.key3)
    })
  })
})
