/** @module Util */
const	typeNames = {
  STR: 'string',
  FN: 'function',
  OBJ: 'object',
  NUM: 'number',
  BOOL: 'boolean',
  SYM: 'symbol',
  UNDEF: 'undefined'
}

const {
  STR
} = typeNames

export class TypeGuardError extends TypeError {
  static defaultMessage = 'Invalid argument.'
  static name = 'TypeGuardError'

  constructor(message = TypeGuardError.defaultMessage, ...rest) {
    super(message, ...rest)
    this.name = TypeGuardError.name
  }
}

/**
 * Wraps `_isArrOf` with type guards; see {@link module:Util~_isArrOf}
 * @type {TypeValidator}
 * @func isArrOf
 * @param value {Array} Required
 * @param typeFn {TypeValidator} Required
 * @return {boolean}
 */
export const isArrOf = withTypeGuards(_isArrOf,
  [isArr],
  [isFn]
)

/**
 * Wraps `_makeOnlyOwnBooleans` with type guards; see {@link module:Util~_makeOnlyOwnBooleans}
 * @func makeOnlyOwnBooleans
 * @param obj {Object} Required
 * @param props {string[]} Optional
 * @return {boolean}
 */
export const makeOnlyOwnBooleans = withTypeGuards(_makeOnlyOwnBooleans,
  [isObj, 'Object of booleans is required.'],
  [isOptional(isStr), 'Property names required as strings.'],
)

/**
 * Wraps Array's `every` instance method
 * @func _isArrOf
 * @param value {Array} Array containing values to test
 * @param typeFn {TypeValidator} Callback function to test each value
 * @return {boolean} `true` if every value in the array tests true; otherwise `false`
 */
export function _isArrOf(value, typeFn) { return value.every(typeFn) }

/**
 * Object factory that converts own properties of object to boolean, or intersects an
 * array of properties with object properties to do the same
 * @func _makeOnlyOwnBooleans
 * @param obj {Object} Object containing properties to convert to boolean
 * @param [props] {string[]} Array of property names for intersection with object properties
 * @return {Object} Object of booleans
 */
export function _makeOnlyOwnBooleans(obj, ...props) {
  const result = {}

  if (props.length) {
    for (const k of props) {
      if (Object.hasOwn(obj, k))
        result[k] = !!obj[k]
    }

  } else {
    for (const k of Object.keys(obj)) {
      result[k] = !!obj[k]
    }
  }

  return result
}

/**
 * Wraps Array's 'isArray' static method
 * @type {TypeValidator}
 * @func isArr
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export function isArr(value) { return Array.isArray(value) }

/**
 * Pass with no test
 * @type {TypeValidator}
 * @func isAny
 * @return {boolean} Returns `true`
 */
export function isAny() { return true }

/**
 * Wraps `typeof` operator for `bigint`
 * @type {TypeValidator}
 * @func isBigInt
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export function isBigInt(value) { return typeof value === 'bigint' }

/**
 * Wraps `typeof` operator for `boolean`
 * @type {TypeValidator}
 * @func isBool
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export function isBool(value) { return typeof value === 'boolean' }

/**
 * Wraps `typeof` operator for `function`
 * @type {TypeValidator}
 * @func isFn
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export function isFn(value) { return typeof value === 'function' }

/**
 * Wraps `typeof` operator for `number`
 * @type {TypeValidator}
 * @func isNum
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export function isNum(value) { return typeof value === 'number' }

/**
 * Wraps `typeof` operator for `object`
 * @type {TypeValidator}
 * @func isObj
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export function isObj(value) { return typeof value === 'object' }

/**
 * Pass test when `undefined`
 * @func isOptional
 * @param typeFn {TypeValidator} Type validator to call if not `undefined`
 * @return {TypeValidator} Original test wrapped to be optional
 */
export function isOptional(typeFn) {
  return (value, ...typeArgs) => value === void 0 || typeFn(value, ...typeArgs)
}

/**
 * Test for not `undefined`
 * @type {TypeValidator}
 * @func isRequired
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export function isRequired(value) { return value !== void 0 }

/**
 * Wraps `typeof` operator for `string`
 * @type {TypeValidator}
 * @func isStr
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export function isStr(value) { return typeof value === 'string' }

/**
 * Wraps `typeof` operator for `symbol`
 * @type {TypeValidator}
 * @func isSym
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export function isSym(value) { return typeof value === 'symbol' }

/**
 * Test for `undefined`. Note that this does not use the `typeof` operator. To test
 * a value without producing a `ReferenceError`, use `typeof` directly.
 * @type {TypeValidator}
 * @func isUnd
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export function isUnd(value) { return value === void 0 }

/**
 * Walk the prototype chain of the constructor function testing the object at the prototype
 * property for the own property. Note that jsdoc will not generate documentation for this function
 * due to an issue with skipping names beginning with `prototype`; this documentation was generated
 * with modifications to `lib/jsdoc/name.js`.
 * @func prototypeChainHasOwn
 * @param fn {function} Constructor function at the beginning of the chain
 * @param prop {(string|symbol)} Own property of the prototype property object
 * @return {?Object} Prototype property object of the constructor function having the own property or null
 */
export function prototypeChainHasOwn(fn, prop) {
  let next = fn

  while (next != null) {
    if (next.prototype != null && Object.hasOwn(next.prototype, prop)) {
      return next.prototype
    }
    next = Object.getPrototypeOf(next)
  }

  return null
}

/**
 * @typedef TypeValidator
 * @type {function}
 * @desc Function to perform argument validation
 * @param value {any} Value to validate
 * @param args {...any} Additional arguments to support validation
 * @return {boolean} Result of validation
 */

/**
 * @typedef TypeGuard
 * @type {Array}
 * @desc Array configuring type validation for an argument
 * @property 0 {TypeValidator} Performs argument validation
 * @property 1 {string} TypeGuardError message to throw when validation returns `false`; unspecified
 * or empty string indicates the default message
 * @property 2 {...any} Additional arguments to TypeValidator
 */

/**
 * Type guard decorator for functions
 * @func withTypeGuards
 * @param targetFn {function} Function to execute with valid arguments
 * @param types {...TypeGuardType} Type guard configurations per target argument
 * @throws {TypeGuardError}
 * @return {function} Target function wrapped in type guards for target argument validation
 */
export function withTypeGuards(targetFn, ...types) {
  return (...targetArgs) => {
    let index = -1
    let length = Math.max(targetArgs.length, types.length)

    while (++index < length) {
      const [typeFn, message, ...typeArgs] = types[index] || types[types.length - 1]
      typeFn(targetArgs[index], ...typeArgs) || throw new TypeGuardError(message)
    }

    return targetFn(...targetArgs)
  }
}

/**
 * Type guard decorator for functions
 * @func withTypeGuardFns
 * @param targetFn {function} Function to execute with valid arguments
 * @param typeFns {...TypeGuardType} Type guard functions per target argument
 * @throws {TypeGuardError}
 * @return {function} Target function wrapped in type guards for target argument validation
 */
export function withTypeGuardFns(targetFn, ...typeFns) {
  return (...targetArgs) => {
    let index = -1
    let length = Math.max(targetArgs.length, typeFns.length)

    while (++index < length) {
      const typeFn = typeFns[index] || typeFns[typeFns.length - 1]
      typeFn(targetArgs[index]) || throw new TypeGuardError(withTypeGuardFns.getDefaultMessage(index))
    }

    return targetFn(...targetArgs)
  }
}

withTypeGuardFns.getDefaultMessage = index => `Invalid argument at index ${index}.`
