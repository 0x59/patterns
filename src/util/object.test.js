import * as Module from './object'
import {
  _makeOnlyOwnBooleans,
  makeOnlyOwnBooleans,
  prototypeChainHasOwn
} from './object'
import {
  isObj,
  isOptional,
  isStr,
  TypeGuardError,
  withTypeGuards,
  withTypeGuardFns
} from './types'
import {
  expectTypeTestsToBe,
  expectAllTypeTestsExceptToBe
} from '../testUtil'
import { jest } from '@jest/globals'

describe('util/object', () => {

  it('exports correct module interface', () => {
    const expected = {
      _makeOnlyOwnBooleans: expect.any(Function),
      makeOnlyOwnBooleans: expect.any(Function),
      prototypeChainHasOwn: expect.any(Function)
    }

    expect(Object.keys(Module).sort()).toEqual(Object.keys(expected).sort())
    expect(Module).toEqual(expect.objectContaining(expected))
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
      expect(() => makeOnlyOwnBooleans(0)).toThrow(TypeGuardError)
      expect(() => makeOnlyOwnBooleans({})).not.toThrow()
    })

    it('optional argument must be an array', () => {
      expect(() => makeOnlyOwnBooleans({}, 0)).toThrow(TypeGuardError)
      expect(() => makeOnlyOwnBooleans({}, 'test1')).not.toThrow()
    })

  })

  describe('prototypeChainHasOwn()', () => {

    it('returns `null` for all primitives', () => {
      expectAllTypeTestsExceptToBe(
        {fn: prototypeChainHasOwn, result: null},
        'array', 'object', 'function'
      )
    })

    it('returns `null` for props other than strings and symbols', () => {
      const fn = v => prototypeChainHasOwn({}, v)
      expectAllTypeTestsExceptToBe({fn, result: null}, 'string', 'symbol')
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
