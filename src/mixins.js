/** @module Mixins */
import { prototypeChainHasOwn } from './util'

const	mixinSymbols = new Map()

/**
 * @typedef Mixin
 * @type {function} Function with a body that defines and returns a class expression extending the parameter
 * @param superclass {class} Class to extend
 * @return {class} Mixin application binding the class expression (definition) to the superclass
 */

/**
 * @typedef MixinFeature
 * @type {function} Function executed per application to provide additional functionality
 * @param internals {Object} Private variables of the mixin application process to aid feature building
 * @param internals.application {class} Mixin application (the effective class hierarchy after applying the current mixin)
 * @param internals.classHierarchy {class} Class hierarchy prior to the current mixin application
 * @param internals.mixin {Mixin} Current mixin applied
 * @param internals.mixins {Mixin[]} All mixins being applied
 * @param internals.mixinSymbol {symbol} Symbol for uniquely mapping to the mixin reference on the application prototype to support `instanceof`.
 * @param internals.mixinSymbols {symbol[]} Symbols for all mixins being applied
 * @param internals.superclass {class} Class being extended
 * @return {class} Mixin application
 */

/**
 * Provides mixin application to a superclass using parameterized ES2015 class expressions
 * @func withMixins
 * @param superclass {class} Class to extend
 * @param mixins {...Mixin} Mixins to apply as ordered
 * @return {class} Superclass extended by the mixin applications
 */
export const withMixins = (superclass, ...mixins) => {
  return mixins.reduce((classHierarchy, mixin) => {
    if( !mixinSymbols.has(mixin) ) {
      mixinSymbols.set(mixin, Symbol())
    }

    const mixinSymbol = mixinSymbols.get(mixin)

    // Define hasInstance one time per mixin
    if( !Object.hasOwn(mixin, Symbol.hasInstance) ) {
      Object.defineProperty(mixin, Symbol.hasInstance, {
        // Use mixin reference as test value for instanceof support
        value: instance => mixin === instance[mixinSymbol]
      })
    }

    const application = mixin(classHierarchy)

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

/**
 * /wɪθ ˈmɪksɪns eɪ/ When `withMixins` simply isn't enough
 * @func withMixinsA
 * @param superclass {class} Class to extend
 * @param mixins {Mixin[]} Mixins to apply as ordered
 * @param apply {MixinFeature[]} Feature functions to apply per application
 * @return {class} Superclass extended by the mixin applications
 */
export const withMixinsA = (superclass, mixins = [], apply = []) => {
  return mixins.reduce((classHierarchy, mixin) => {
    if( !mixinSymbols.has(mixin) ) {
      mixinSymbols.set(mixin, Symbol())
    }

    const mixinSymbol = mixinSymbols.get(mixin)

    // Define hasInstance one time per mixin
    if( !Object.hasOwn(mixin, Symbol.hasInstance) ) {
      Object.defineProperty(mixin, Symbol.hasInstance, {
        // Use mixin reference as test value for instanceof support
        value: instance => mixin === instance[mixinSymbol]
      })
    }

    const application = mixin(classHierarchy)

    // Allow only one application of the mixin per hierarchy
    if( prototypeChainHasOwn(application, mixinSymbol) === null ) {
      // Set mixin reference for hasInstance test
      application.prototype[mixinSymbol] = mixin;

      return apply.length
        ? apply.reduce((application, featureFn) => {
            return featureFn({
              application,
              classHierarchy,
              mixin,
              mixins,
              mixinSymbol,
              mixinSymbols,
              superclass
            })
          }, application)
        : application
    } else {
      return classHierarchy
    }

  }, superclass)
}

