/** @module Util */
/**
 * Traverse the prototype chain of the object for the own property
 * @func prototypeChainHasOwn
 * @param obj {object} The object at the beginning of the chain
 * @param prop {string} The own property of the prototype object
 * @return {object} The prototype object having the own property or null
 */
export function prototypeChainHasOwn(obj, prop) {
  let next = obj

  while( next != null ) {
    if( next.prototype != null && Object.hasOwn(next.prototype, prop) ) {
      return next.prototype
    }
    next = Object.getPrototypeOf(next)
  }

  return null
}
