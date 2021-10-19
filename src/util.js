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
 * @param target {function} Function to execute with valid arguments
 * @param types {...TypeGuardType} Type guard configurations per target argument
 * @throws {TypeGuardError}
 * @return {function} Target function wrapped in type guards for target argument validation
 */
export const withTypeGuards = (target, ...types) => (...targetArgs) => {
  targetArgs.forEach((arg, index) => {
    const [typeFn, message, ...typeArgs] = types[index] || types[types.length - 1]
    typeFn(arg, ...typeArgs) || throw new TypeGuardError(message)
  })

  if (targetArgs.length < types.length) {
    for (const [typeFn, message, ...typeArgs] of types.slice(targetArgs.length)) {
      typeFn(void 0, ...typeArgs) || throw new TypeGuardError(message)
    }
  }

  return target(...targetArgs)
}

/**
 * Wraps Array's `every` instance method
 * @func _isArrOf
 * @param value {Array} Array containing values to test
 * @param typeFn {TypeValidator} Callback function to test each value
 * @return {boolean} `true` if every value in the array tests true; otherwise `false`
 */
export const _isArrOf = (value, typeFn) => value.every(typeFn)

/**
 * Object factory that converts own properties of object to boolean, or intersects an
 * array of properties with object properties to do the same
 * @func _makeOnlyOwnBooleans
 * @param obj {Object} Object containing properties to convert to boolean
 * @param [props] {string[]} Array of property names for intersection with object properties
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
 * @type {TypeValidator}
 * @func isArr
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isArr = value => Array.isArray(value)

/**
 * Wraps `typeof` operator for `bigint`
 * @type {TypeValidator}
 * @func isBigInt
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isBigInt = value => typeof value === 'bigint'

/**
 * Wraps `typeof` operator for `boolean`
 * @type {TypeValidator}
 * @func isBool
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isBool = value => typeof value === 'boolean'

/**
 * Wraps `typeof` operator for `function`
 * @type {TypeValidator}
 * @func isFn
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isFn = value => typeof value === 'function'

/**
 * Wraps `typeof` operator for `number`
 * @type {TypeValidator}
 * @func isNum
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isNum = value => typeof value === 'number'

/**
 * Wraps `typeof` operator for `object`
 * @type {TypeValidator}
 * @func isObj
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isObj = value => typeof value === 'object'

/**
 * Test for not `undefined`
 * @type {TypeValidator}
 * @func isRequired
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isRequired = value => value !== void 0

/**
 * Pass test when `undefined`
 * @func isOptional
 * @param typeFn {TypeValidator} Type validator to call if not `undefined`
 * @return {TypeValidator} Original test wrapped to be optional
 */
export const isOptional = typeFn => (value, ...typeArgs) => value === void 0 || typeFn(value, ...typeArgs)

/**
 * Wraps `typeof` operator for `string`
 * @type {TypeValidator}
 * @func isStr
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isStr = value => typeof value === 'string'

/**
 * Wraps `typeof` operator for `symbol`
 * @type {TypeValidator}
 * @func isSym
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isSym = value => typeof value === 'symbol'

/**
 * Test for `undefined`. Note that this does not use the `typeof` operator. To test
 * a value without producing a `ReferenceError`, use `typeof` directly.
 * @type {TypeValidator}
 * @func isUnd
 * @param value {any} Value (operand) to test
 * @return {boolean} Result of the test
 */
export const isUnd = value => value === void 0

/**
 * Wraps `_isArrOf` with type guards; see {@link module:Util~_isArrOf}
 * @type {TypeValidator}
 * @func isArrOf
 * @param value {Array} Is required
 * @param typeFn {TypeValidator} Is required
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
 * Walk the prototype chain of the constructor function testing the object at the prototype
 * property for the own property. Note that jsdoc will not generate documentation for this function
 * due to an issue with skipping names beginning with `prototype`; this documentation was generated
 * with modifications to `lib/jsdoc/name.js`.
 * @func prototypeChainHasOwn
 * @param fn {function} Constructor function at the beginning of the chain
 * @param prop {(string|symbol)} Own property of the prototype property object
 * @return {?Object} Prototype property object of the constructor function having the own property or null
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
