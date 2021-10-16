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

const defaultTypeGuardErrorMessage = 'Invalid argument.'
const typeGuardErrorName = 'TypeGuardError'

class TypeGuardError extends TypeError {
  constructor(message = defaultTypeGuardErrorMessage, ...rest) {
    super(message, ...rest)
    this.name = typeGuardErrorName
  }
}

/**
 * @typedef TypeValidator
 * @type {function}
 * @desc Function to perform argument validation
 * @param value {any} Value to validate
 * @param args {...any} Additional validator arguments to support validation
 * @return {boolean}
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
 * @func withTypes
 * @param target {function} Function to execute with valid arguments
 * @param types {...TypeGuardType} Type guard configurations per target argument
 * @return {function} Target function wrapped in type guards for target argument validation
 */
export const withTypes = (target, ...types) => (...targetArgs) => {
  for (const [index, arg] of targetArgs.entries()) {
    const [typeFn, message, ...typeArgs] = types[index] || types[types.length - 1]
    if (!typeFn(arg, ...typeArgs)) {
      throw new TypeGuardError(message)
    }
  }

  return target(...targetArgs)
}

/**
 * Wraps type validators to require arguments
 * @func isRequired
 * @param typeFn {TypeValidator} Type validator to wrap
 * @return {function} Type validator wrapped with required argument test
 */
export const isRequired = typeFn => (arg, ...rest) => arg !== void 0 && typeFn(arg, ...rest)

/**
 * Wraps Array's `every` instance method
 * @func _isArrOf
 * @param value {Array} Array containing values to test
 * @param typeFn {function} Callback function to test each value
 * @return {boolean} `true` if every value in the array tests true; otherwise `false`
 */
export const _isArrOf = (value, typeFn) => value.every(typeFn)

/**
 * Object factory that converts own properties of object to boolean, or intersects an
 * array of properties with object properties to do the same
 * @func _makeOnlyOwnBooleans
 * @param obj {Object} Object containing properties to convert to boolean
 * @param props {string[]} Array of property names for intersection with object properties
 * @return {Object} Object of booleans
 */
export const _makeOnlyOwnBooleans = (obj, ...props) => {
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
 * @func isArr
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isArr = value => Array.isArray(value)

/**
 * Wraps `typeof` operator for `bigint`
 * @func isBigInt
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isBigInt = value => typeof value === 'bigint'

/**
 * Wraps `typeof` operator for `boolean`
 * @func isBool
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isBool = value => typeof value === 'boolean'

/**
 * Wraps `typeof` operator for `function`
 * @func isFn
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isFn = value => typeof value === 'function'

/**
 * Wraps `typeof` operator for `number`
 * @func isNum
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isNum = value => typeof value === 'number'

/**
 * Wraps `typeof` operator for `object`
 * @func isObj
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isObj = value => typeof value === 'object'

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
 * Wraps `typeof` operator for `undefined`
 * @func isUnd
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isUnd = value => typeof value === 'undefined'

/**
 * Wraps `_isArrOf` with type guards; see {@link module:Util~_isArrOf}
 * @func isArrOf
 * @param value {Array} Is required
 * @param typeFn {function} Is required
 * @return {boolean}
 */
export const isArrOf = withTypes(_isArrOf,
  [isRequired(isArr)],
  [isRequired(isFn)]
)

/**
 * Wraps `_makeOnlyOwnBooleans` with type guards; see {@link module:Util~_makeOnlyOwnBooleans}
 * @func makeOnlyOwnBooleans
 * @param obj {Object} Required
 * @param props {string[]} Optional
 * @return {boolean}
 */
export const makeOnlyOwnBooleans = withTypes(_makeOnlyOwnBooleans,
  [isRequired(isObj), 'Object of booleans is required.'],
  [isStr, 'Property names are required.'],
)

/**
 * Walk the prototype chain of the constructor function testing the object at the prototype
 * property for the own property. Note that jsdoc will not generate documentation for this function
 * due to an issue with skipping names beginning with `prototype`; this documentation was generated
 * with modifications to `lib/jsdoc/name.js`.
 * @func prototypeChainHasOwn
 * @param fn {function} Constructor function at the beginning of the chain
 * @param prop {(string|symbol)} Own property of the prototype property object
 * @return {(Object|null)} Prototype property object of the constructor function having the own property or null
 */
export const prototypeChainHasOwn = (fn, prop) => {
  let next = fn

  while (next != null) {
    if (next.prototype != null && Object.hasOwn(next.prototype, prop)) {
      return next.prototype
    }
    next = Object.getPrototypeOf(next)
  }

  return null
}
