/** @module Mixins */
import { prototypeChainHasOwn } from './util'

const	mixinSymbols = new Map()

/**
 * Provides mixin application using ES6 class expressions
 * @func superclassWithMixins
 * @param superclass {class} The class to be extended
 * @param mixins {array} Functions that return a class expression extending the parameter
 * @return {class} The superclass extended by the mixin applications
 */
export function superclassWithMixins(superclass, ...mixins) {
  return mixins.reduce((classHierarchy, mixin) => {
    if( !mixinSymbols.has(mixin) ) {
      mixinSymbols.set(mixin, Symbol())
    }

    const mixinSymbol = mixinSymbols.get(mixin)
    const application = mixin(classHierarchy)

    // Define hasInstance one time per mixin
    if( !Object.hasOwn(mixin, Symbol.hasInstance) ) {
      Object.defineProperty(mixin, Symbol.hasInstance, {
        // Use mixin reference as test value for instanceof support
        value: instance => mixin === instance[mixinSymbol]
      })
    }

    // Allow only one application of the mixin per hierarchy
    if( prototypeChainHasOwn(application, mixinSymbol) === null ) {
      // Set mixin reference for hasInstance test
      application.prototype[mixinSymbol] = mixin;

      return application
    } else {
      return classHierarchy
    }

  }, superclass)
}
