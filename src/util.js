/** @module Util */

/**
 * Wraps `typeof` operator for `undefined`
 * @func isUnd
 * @param value {any} The value (operand) to test
 * @return {boolean} Result of the test
 */
export const isUnd = value => typeof value === 'undefined'

/**
 * Wraps `typeof` operator for `boolean`
 * @func isBool
 * @param value {any} The value (operand) to test
 * @return {boolean} Result of the test
 */
export const isBool = value => typeof value === 'boolean'

/**
 * Wraps `typeof` operator for `number`
 * @func isNum
 * @param value {any} The value (operand) to test
 * @return {boolean} Result of the test
 */
export const isNum = value => typeof value === 'number'

/**
 * Wraps `typeof` operator for `bigint`
 * @func isBigInt
 * @param value {any} The value (operand) to test
 * @return {boolean} Result of the test
 */
export const isBigInt = value => typeof value === 'bigint'

/**
 * Wraps `typeof` operator for `string`
 * @func isStr
 * @param value {any} The value (operand) to test
 * @return {boolean} Result of the test
 */
export const isStr = value => typeof value === 'string'

/**
 * Wraps `typeof` operator for `symbol`
 * @func isSym
 * @param value {any} The value (operand) to test
 * @return {boolean} Result of the test
 */
export const isSym = value => typeof value === 'symbol'

/**
 * Wraps `typeof` operator for `function`
 * @func isFn
 * @param value {any} The value (operand) to test
 * @return {boolean} Result of the test
 */
export const isFn = value => typeof value === 'function'

/**
 * Wraps `typeof` operator for `object`
 * @func isObj
 * @param value {any} The value (operand) to test
 * @return {boolean} Result of the test
 */
export const isObj = value => typeof value === 'object'

/**
 * Traverse the `.prototype` chain of the object for the own property
 * @func prototypeChainHasOwn
 * @param obj {object} The object at the beginning of the chain
 * @param prop {(string|symbol)} The own property of the `.prototype` object
 * @return {(object|null)} The `.prototype` object having the own property or null
 */
export const prototypeChainHasOwn = (obj, prop) => {
  let next = obj

  while( next != null ) {
    if( next.prototype != null && Object.hasOwn(next.prototype, prop) ) {
      return next.prototype
    }
    next = Object.getPrototypeOf(next)
  }

  return null
}
