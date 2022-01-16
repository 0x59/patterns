import * as Module from './types'
import {
  expectTypeTestsToBe,
  expectAllTypeTestsExceptToBe
} from '../testUtil'
import { jest } from '@jest/globals'

const {
  _isArrOf,
  isAny,
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
  typeNames,
  TypeGuardError,
  withTypeGuards,
  withTypeGuardFns
} = Module

describe('util/types', () => {

  it('exports correct module interface', () => {
    const expected = {
      _isArrOf: expect.any(Function),
      isAny: expect.any(Function),
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
      typeNames: expect.any(Object),
      TypeGuardError: expect.any(Function),
      withTypeGuards: expect.any(Function),
      withTypeGuardFns: expect.any(Function)
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
      expect(() => isArrOf(void 0, isType)).toThrow(TypeGuardError)
      expect(() => isArrOf([], isType)).not.toThrow()
    })

    it('requires a type function', () => {
      const isType = jest.fn(() => true)
      expect(() => isArrOf([])).toThrow(TypeGuardError)
      expect(() => isArrOf([], isType)).not.toThrow()
    })

  })

  describe('isAny()', () => {

    it('returns `true` for any value', () => {
      expectAllTypeTestsExceptToBe({fn: isAny, result: true})
    })

  })

  describe('isArr()', () => {

    it('returns `true` when value is an array', () => {
      expect(isArr([])).toBe(true)
    })

    it('returns `false` when value is not an array', () => {
      expectAllTypeTestsExceptToBe({fn: isArr, result: false}, 'array')
    })

  })

  describe('isBigInt()', () => {

    it('returns `true` when value is a bigint', () => {
      expect(isBigInt(0n)).toBe(true)
    })

    it('returns `false` when value is not a bigint', () => {
      expectAllTypeTestsExceptToBe({fn: isBigInt, result: false}, 'bigint')
    })

  })

  describe('isBool()', () => {

    it('returns `true` when value is boolean', () => {
      expect(isBool(true)).toBe(true)
      expect(isBool(false)).toBe(true)
    })

    it('returns `false` when value is not boolean', () => {
      expectAllTypeTestsExceptToBe({fn: isBool, result: false}, 'boolean')
    })

  })

  describe('isFn()', () => {

    it('returns `true` when value is a function', () => {
      expect(isFn(() => {})).toBe(true)
    })

    it('returns `false` when value is not a function', () => {
      expectAllTypeTestsExceptToBe({fn: isFn, result: false}, 'function')
    })

  })

  describe('isNum()', () => {

    it('returns `true` when value is a number', () => {
      expect(isNum(0)).toBe(true)
    })

    it('returns `false` when value is not a number', () => {
      expectAllTypeTestsExceptToBe({fn: isNum, result: false}, 'number')
    })

  })

  describe('isObj()', () => {

    it('returns `true` when value is an object', () => {
      expectTypeTestsToBe({fn: isObj, result: true}, 'object', 'null', 'array')
    })

    it('returns `false` when value is not an object', () => {
      expectAllTypeTestsExceptToBe({fn: isObj, result: false}, 'object', 'null', 'array')
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
      expectAllTypeTestsExceptToBe({fn: isRequired, result: true}, 'undefined')
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
      expectAllTypeTestsExceptToBe({fn: isStr, result: false}, 'string')
    })

  })

  describe('isSym()', () => {

    it('returns `true` when value is a symbol', () => {
      expect(isSym(Symbol())).toBe(true)
    })

    it('returns `false` when value is not a symbol', () => {
      expectAllTypeTestsExceptToBe({fn: isSym, result: false}, 'symbol')
    })

  })

  describe('isUnd()', () => {

    it('returns `true` when value is `undefined`', () => {
      expect(isUnd(void 0)).toBe(true)
    })

    it('returns `false` when value is not `undefined`', () => {
      expectAllTypeTestsExceptToBe({fn: isUnd, result: false}, 'undefined')
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

  describe('withTypeGuardFns()', () => {
    let targetFn
    let targetWithTypeGuard
    let type1Fn
    let type2Fn
    const arg1 = { arg1: 'test' }
    const arg2 = { arg2: 'test' }
    const arg3 = { arg3: 'test' }
    const type2Arg1 = { type2Arg1: 'test' }
    const type2Arg2 = { type2Arg2: 'test' }

    beforeEach(() => {
      targetFn = jest.fn()
      type1Fn = jest.fn(() => true)
      type2Fn = jest.fn(() => true)
      targetWithTypeGuard = withTypeGuardFns(
        targetFn,
        type1Fn,
        a => type2Fn(a, type2Arg1, type2Arg2)
      )
    })

    it('returns a function', () => {
      expect(withTypeGuardFns()).toEqual(expect.any(Function))
    })

    it('calls target with correct arguments', () => {
      targetWithTypeGuard(arg1, arg2)

      expect(targetFn).toBeCalledTimes(1)
      expect(targetFn).toBeCalledWith(arg1, arg2)
    })

    it('calls type functions with correct arguments', () => {
      targetWithTypeGuard(arg1, arg2)

      expect(type1Fn).toBeCalledTimes(1)
      expect(type1Fn).toBeCalledWith(arg1)
      expect(type2Fn).toBeCalledTimes(1)
      expect(type2Fn).toBeCalledWith(arg2, type2Arg1, type2Arg2)
    })

    it('uses last type for rest arguments', () => {
      targetWithTypeGuard(arg1, arg2, arg3)

      expect(type1Fn).toBeCalledTimes(1)
      expect(type1Fn).toBeCalledWith(arg1)
      expect(type2Fn).toBeCalledTimes(2)
      expect(type2Fn).toBeCalledWith(arg2, type2Arg1, type2Arg2)
      expect(type2Fn).lastCalledWith(arg3, type2Arg1, type2Arg2)
    })

    it('uses `undefined` to run remaining type tests', () => {
      targetWithTypeGuard()

      expect(type1Fn).toBeCalledTimes(1)
      expect(type1Fn).toBeCalledWith(void 0)
      expect(type2Fn).toBeCalledTimes(1)
      expect(type2Fn).toBeCalledWith(void 0, type2Arg1, type2Arg2)
    })

    it('throws correct message for invalid arguments', () => {
      type1Fn = jest.fn(() => false)
      targetWithTypeGuard = withTypeGuardFns(targetFn,
        type1Fn,
        type2Fn
      )

      try { targetWithTypeGuard(arg1, arg2) } catch(e) {
        expect(e.message).toBe(withTypeGuardFns.getDefaultMessage(0))
      }

      type1Fn = jest.fn(() => true)
      type2Fn = jest.fn(() => false)
      targetWithTypeGuard = withTypeGuardFns(targetFn,
        type1Fn,
        a => type2Fn(a, type2Arg1, type2Arg2)
      )

      try { targetWithTypeGuard(arg1, arg2) } catch(e) {
        expect(e.message).toBe(withTypeGuardFns.getDefaultMessage(1))
      }
    })
  })
})
