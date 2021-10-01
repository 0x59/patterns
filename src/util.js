/** @module Util */

/**
 * Traverse the `.prototype` chain of the constructor function for the own property.
 * Note that jsdoc will not generate documentation for this function due to an issue
 * with skipping names beginning with `prototype`.  This documentation was generated
 * with modifications to `jsdoc-core/lib/name.js`.
 * @func prototypeChainHasOwn
 * @param fn {function} Constructor function at the beginning of the chain
 * @param prop {(string|symbol)} Own property of the `.prototype` object
 * @return {(object|null)} `.prototype` object having the own property or null
 */
export const prototypeChainHasOwn = (fn, prop) => {
  let next = fn

  while( next != null ) {
    if( next.prototype != null && Object.hasOwn(next.prototype, prop) ) {
      return next.prototype
    }
    next = Object.getPrototypeOf(next)
  }

  return null
}

/**
 * Wraps `typeof` operator for `undefined`
 * @func isUnd
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isUnd = value => typeof value === 'undefined'

/**
 * Wraps `typeof` operator for `boolean`
 * @func isBool
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isBool = value => typeof value === 'boolean'

/**
 * Wraps `typeof` operator for `number`
 * @func isNum
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isNum = value => typeof value === 'number'

/**
 * Wraps `typeof` operator for `bigint`
 * @func isBigInt
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isBigInt = value => typeof value === 'bigint'

/**
 * Wraps `typeof` operator for `string`
 * @func isStr
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isStr = value => typeof value === 'string'

/**
 * Wraps `typeof` operator for `symbol`
 * @func isSym
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isSym = value => typeof value === 'symbol'

/**
 * Wraps `typeof` operator for `function`
 * @func isFn
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isFn = value => typeof value === 'function'

/**
 * Wraps `typeof` operator for `object`
 * @func isObj
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isObj = value => typeof value === 'object'
