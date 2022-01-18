/** @module util/object */

import {
  isObj,
  isOptional,
  isStr,
  TypeGuardError,
  withTypeGuards,
  withTypeGuardFns
} from './types'


/**
 * Wraps `_makeOnlyOwnBooleans` with type guards; see {@link module:util/object~_makeOnlyOwnBooleans}
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
