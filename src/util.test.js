import * as Module from './util'
import {
  _isArrOf,
  _makeOnlyOwnBooleans,
  isArr,
  isArrOf,
  isBigInt,
  isBool,
  isFn,
  isNum,
  isObj,
  isOptional,
  isRequired,
  isStr,
  isSym,
  isUnd,
  makeOnlyOwnBooleans,
  prototypeChainHasOwn,
  TypeGuardError,
  withTypeGuards
} from './util'
import { jest } from '@jest/globals'

describe('Util', () => {

  it('exports correct module interface', () => {
    const expected = {
      _isArrOf: expect.any(Function),
      _makeOnlyOwnBooleans: expect.any(Function),
      isArr: expect.any(Function),
      isArrOf: expect.any(Function),
      isBigInt: expect.any(Function),
      isBool: expect.any(Function),
      isFn: expect.any(Function),
      isNum: expect.any(Function),
      isObj: expect.any(Function),
      isOptional: expect.any(Function),
      isRequired: expect.any(Function),
      isStr: expect.any(Function),
      isSym: expect.any(Function),
      isUnd: expect.any(Function),
      makeOnlyOwnBooleans: expect.any(Function),
      prototypeChainHasOwn: expect.any(Function),
      TypeGuardError: expect.any(Function),
      withTypeGuards: expect.any(Function)
    }

    expect(Object.keys(Module).sort()).toEqual(Object.keys(expected).sort())
    expect(Module).toEqual(expect.objectContaining(expected))
  })

  describe('_isArrOf()', () => {

    it('returns `true` for empty array', () => {
      const isType = jest.fn(() => true)
      expect(_isArrOf([], isType)).toBe(true)
      expect(isType).not.toBeCalled()
    })

    it('returns `true` for correct type', () => {
      const isType = jest.fn(() => true)
      expect(_isArrOf([0, 0], isType)).toBe(true)
      expect(isType).toBeCalledTimes(2)
    })

    it('returns `false` for incorrect type', () => {
      const isType = jest.fn(() => false)
      expect(_isArrOf([0, 0], isType)).toBe(false)
      expect(isType).toBeCalledTimes(1)
    })

  })

  describe('isArrOf()', () => {

    it('requires an array', () => {
      const isType = jest.fn(() => true)
      expect(() => isArrOf(void 0, isType)).toThrowError(TypeGuardError)
      expect(() => isArrOf([], isType)).not.toThrow()
    })

    it('requires a type function', () => {
      const isType = jest.fn(() => true)
      expect(() => isArrOf([])).toThrowError(TypeGuardError)
      expect(() => isArrOf([], isType)).not.toThrow()
    })

  })

  describe('_makeOnlyOwnBooleans()', () => {

    it('converts only own properties to boolean', () => {
      const obj = Object.create({ test1: 'test1' })
      obj.test2 = 'test2'
      obj.test3 = ''

      expect(_makeOnlyOwnBooleans(obj)).toEqual({test2: true, test3: false})
    })

    it('intersects listed properties with own properties', () => {
      const obj = Object.create({test1: 'test1'})
      obj.test2 = 'test2'
      obj.test3 = ''

      expect(_makeOnlyOwnBooleans(obj, 'test1', 'test2')).toEqual({test2: true})
    })

  })

  describe('makeOnlyOwnBooleans()', () => {

    it('requires an object', () => {
      expect(() => makeOnlyOwnBooleans(0)).toThrowError(TypeGuardError)
      expect(() => makeOnlyOwnBooleans({})).not.toThrow()
    })

    it('optional argument must be an array', () => {
      expect(() => makeOnlyOwnBooleans({}, 0)).toThrow(TypeGuardError)
      expect(() => makeOnlyOwnBooleans({}, 'test1')).not.toThrow()
    })

  })

  describe('isArr()', () => {

    it('returns `true` when value is an array', () => {
      expect(isArr([])).toBe(true)
    })

    it('returns `false` when value is not an array', () => {
      expect(isArr(void 0)).toBe(false)
      expect(isArr('test')).toBe(false)
      expect(isArr(() => {})).toBe(false)
      expect(isArr(0)).toBe(false)
      expect(isArr(1n)).toBe(false)
      expect(isArr(Symbol())).toBe(false)
      expect(isArr(null)).toBe(false)
      expect(isArr(true)).toBe(false)
      expect(isArr({})).toBe(false)
    })

  })

  describe('isBigInt()', () => {

    it('returns `true` when value is a bigint', () => {
      expect(isBigInt(0n)).toBe(true)
    })

    it('returns `false` when value is not a bigint', () => {
      expect(isBigInt('test')).toBe(false)
      expect(isBigInt(() => {})).toBe(false)
      expect(isBigInt(1)).toBe(false)
      expect(isBigInt(Symbol())).toBe(false)
      expect(isBigInt(null)).toBe(false)
      expect(isBigInt(true)).toBe(false)
      expect(isBigInt(void 0)).toBe(false)
      expect(isBigInt({})).toBe(false)
    })

  })

  describe('isBool()', () => {

    it('returns `true` when value is boolean', () => {
      expect(isBool(true)).toBe(true)
      expect(isBool(false)).toBe(true)
    })

    it('returns `false` when value is not boolean', () => {
      expect(isBool('test')).toBe(false)
      expect(isBool(() => {})).toBe(false)
      expect(isBool(0)).toBe(false)
      expect(isBool(1n)).toBe(false)
      expect(isBool(Symbol())).toBe(false)
      expect(isBool(null)).toBe(false)
      expect(isBool(void 0)).toBe(false)
      expect(isBool({})).toBe(false)
    })

  })

  describe('isFn()', () => {

    it('returns `true` when value is a function', () => {
      expect(isFn(() => {})).toBe(true)
    })

    it('returns `false` when value is not a function', () => {
      expect(isFn('test')).toBe(false)
      expect(isFn(1)).toBe(false)
      expect(isFn(1n)).toBe(false)
      expect(isFn(Symbol())).toBe(false)
      expect(isFn(null)).toBe(false)
      expect(isFn(true)).toBe(false)
      expect(isFn(void 0)).toBe(false)
      expect(isFn({})).toBe(false)
    })

  })

  describe('isNum()', () => {

    it('returns `true` when value is a number', () => {
      expect(isNum(0)).toBe(true)
    })

    it('returns `false` when value is not a number', () => {
      expect(isNum('test')).toBe(false)
      expect(isNum(() => {})).toBe(false)
      expect(isNum(1n)).toBe(false)
      expect(isNum(Symbol())).toBe(false)
      expect(isNum(null)).toBe(false)
      expect(isNum(true)).toBe(false)
      expect(isNum(void 0)).toBe(false)
      expect(isNum({})).toBe(false)
    })

  })

  describe('isObj()', () => {

    it('returns `true` when value is a object', () => {
      expect(isObj({})).toBe(true)
      expect(isObj(null)).toBe(true)
    })

    it('returns `false` when value is not a object', () => {
      expect(isObj('test')).toBe(false)
      expect(isObj(() => {})).toBe(false)
      expect(isObj(1)).toBe(false)
      expect(isObj(1n)).toBe(false)
      expect(isObj(Symbol())).toBe(false)
      expect(isObj(true)).toBe(false)
      expect(isObj(void 0)).toBe(false)
    })

  })

  describe('isOptional()', () => {

    it('returns a function', () => {
      const typeFn = jest.fn(() => true)
      expect(isOptional(typeFn)).toEqual(expect.any(Function))
    })

    it('returns `true` when value is `undefined` and skips type fn', () => {
      const typeFn = jest.fn(() => true)
      expect(isOptional(typeFn)(void 0)).toBe(true)
      expect(typeFn).not.toBeCalled()
    })

    it('returns `true` with defined value and runs type fn with args', () => {
      const typeFn = jest.fn(() => true)
      const typeArg1 = {}
      const typeArg2 = {}

      expect(isOptional(typeFn)(0, typeArg1, typeArg2)).toBe(true)
      expect(typeFn).toBeCalledWith(0, typeArg1, typeArg2)
    })

  })

  describe('isRequired()', () => {

    it('returns `true` when value is not `undefined`', () => {
      expect(isRequired('test')).toBe(true)
      expect(isRequired(() => {})).toBe(true)
      expect(isRequired(0)).toBe(true)
      expect(isRequired(1n)).toBe(true)
      expect(isRequired(Symbol())).toBe(true)
      expect(isRequired(null)).toBe(true)
      expect(isRequired(true)).toBe(true)
      expect(isRequired({})).toBe(true)
    })

    it('returns `false` when value is `undefined`', () => {
      expect(isRequired(void 0)).toBe(false)
    })

  })

  describe('isStr()', () => {

    it('returns `true` when value is a string', () => {
      expect(isStr('')).toBe(true)
    })

    it('returns `false` when value is not a string', () => {
      expect(isStr(() => {})).toBe(false)
      expect(isStr(1)).toBe(false)
      expect(isStr(1n)).toBe(false)
      expect(isStr(Symbol())).toBe(false)
      expect(isStr(null)).toBe(false)
      expect(isStr(true)).toBe(false)
      expect(isStr(void 0)).toBe(false)
      expect(isStr({})).toBe(false)
    })

  })

  describe('isSym()', () => {

    it('returns `true` when value is a symbol', () => {
      expect(isSym(Symbol())).toBe(true)
    })

    it('returns `false` when value is not a symbol', () => {
      expect(isSym('test')).toBe(false)
      expect(isSym(() => {})).toBe(false)
      expect(isSym(1)).toBe(false)
      expect(isSym(1n)).toBe(false)
      expect(isSym(null)).toBe(false)
      expect(isSym(true)).toBe(false)
      expect(isSym(void 0)).toBe(false)
      expect(isSym({})).toBe(false)
    })

  })

  describe('isUnd()', () => {

    it('returns `true` when value is `undefined`', () => {
      expect(isUnd(void 0)).toBe(true)
    })

    it('returns `false` when value is not `undefined`', () => {
      expect(isUnd('test')).toBe(false)
      expect(isUnd(() => {})).toBe(false)
      expect(isUnd(0)).toBe(false)
      expect(isUnd(1n)).toBe(false)
      expect(isUnd(Symbol())).toBe(false)
      expect(isUnd(null)).toBe(false)
      expect(isUnd(true)).toBe(false)
      expect(isUnd({})).toBe(false)
    })

  })

  describe('prototypeChainHasOwn()', () => {

    it('returns `null` for non-objects', () => {
      expect(prototypeChainHasOwn('test')).toBe(null)
      expect(prototypeChainHasOwn(0)).toBe(null)
      expect(prototypeChainHasOwn(1n)).toBe(null)
      expect(prototypeChainHasOwn(Symbol())).toBe(null)
      expect(prototypeChainHasOwn(null)).toBe(null)
      expect(prototypeChainHasOwn(true)).toBe(null)
      expect(prototypeChainHasOwn(void 0)).toBe(null)
    })

    it('returns `null` for props other than strings and symbols', () => {
      expect(prototypeChainHasOwn({}, 0)).toBe(null)
      expect(prototypeChainHasOwn({}, 1n)).toBe(null)
      expect(prototypeChainHasOwn({}, null)).toBe(null)
      expect(prototypeChainHasOwn({}, true)).toBe(null)
      expect(prototypeChainHasOwn({}, void 0)).toBe(null)
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

  describe('withTypeGuards()', () => {
    let targetFn
    let targetWithTypeGuard
    let type1Fn
    let type2Fn
    const type1ErrMsg = '1 error'
    const type2ErrMsg = '2 error'
    const arg1 = { arg1: 'test' }
    const arg2 = { arg2: 'test' }
    const arg3 = { arg3: 'test' }
    const type1Arg1 = { type1Arg1: 'test' }
    const type1Arg2 = { type1Arg2: 'test' }
    const type2Arg1 = { type2Arg1: 'test' }
    const type2Arg2 = { type2Arg2: 'test' }

    beforeEach(() => {
      targetFn = jest.fn()
      type1Fn = jest.fn(() => true)
      type2Fn = jest.fn(() => true)
      targetWithTypeGuard = withTypeGuards(targetFn,
        [type1Fn, type1ErrMsg, type1Arg1, type1Arg2],
        [type2Fn, type2ErrMsg, type2Arg1, type2Arg2]
      )
    })

    it('returns a function', () => {
      expect(withTypeGuards()).toEqual(expect.any(Function))
    })

    it('calls target with correct arguments', () => {
      targetWithTypeGuard(arg1, arg2)

      expect(targetFn).toBeCalledTimes(1)
      expect(targetFn).toBeCalledWith(arg1, arg2)
    })

    it('calls type functions with correct arguments', () => {
      targetWithTypeGuard(arg1, arg2)

      expect(type1Fn).toBeCalledTimes(1)
      expect(type1Fn).toBeCalledWith(arg1, type1Arg1, type1Arg2)
      expect(type2Fn).toBeCalledTimes(1)
      expect(type2Fn).toBeCalledWith(arg2, type2Arg1, type2Arg2)
    })

    it('uses last type for rest arguments', () => {
      targetWithTypeGuard(arg1, arg2, arg3)

      expect(type1Fn).toBeCalledTimes(1)
      expect(type1Fn).toBeCalledWith(arg1, type1Arg1, type1Arg2)
      expect(type2Fn).toBeCalledTimes(2)
      expect(type2Fn).toBeCalledWith(arg2, type2Arg1, type2Arg2)
      expect(type2Fn).lastCalledWith(arg3, type2Arg1, type2Arg2)
    })

    it('uses `undefined` to run remaining type tests', () => {
      targetWithTypeGuard()

      expect(type1Fn).toBeCalledTimes(1)
      expect(type1Fn).toBeCalledWith(void 0, type1Arg1, type1Arg2)
      expect(type2Fn).toBeCalledTimes(1)
      expect(type2Fn).toBeCalledWith(void 0, type2Arg1, type2Arg2)
    })

    it('throws correct message for invalid arguments', () => {
      type1Fn = jest.fn(() => false)
      targetWithTypeGuard = withTypeGuards(targetFn,
        [type1Fn, type1ErrMsg, type1Arg1, type1Arg2],
        [type2Fn, type2ErrMsg, type2Arg1, type2Arg2]
      )

      try { targetWithTypeGuard(arg1, arg2) } catch(e) {
        expect(e.message).toBe(type1ErrMsg)
      }

      type1Fn = jest.fn(() => true)
      type2Fn = jest.fn(() => false)
      targetWithTypeGuard = withTypeGuards(targetFn,
        [type1Fn, type1ErrMsg, type1Arg1, type1Arg2],
        [type2Fn, type2ErrMsg, type2Arg1, type2Arg2]
      )

      try { targetWithTypeGuard(arg1, arg2) } catch(e) {
        expect(e.message).toBe(type2ErrMsg)
      }
    })

    it('throws a default error message', () => {
      type2Fn = jest.fn(() => false)
      targetWithTypeGuard = withTypeGuards(targetFn,
        [type1Fn, type1ErrMsg, type1Arg1, type1Arg2],
        [type2Fn]
      )

      try { targetWithTypeGuard(arg1, arg2) } catch(e) {
        expect(e.message).not.toBe(type2ErrMsg)
        expect(e.message.length).not.toBe(0)
      }
    })
  })
})
