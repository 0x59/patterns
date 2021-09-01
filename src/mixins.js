
const	mixinSymbols = new Map()

function superclassWithMixins(superclass, ...mixins) {
  return mixins.reduce((classHierarchy, mixin) => {
    if( !mixinSymbols.has(mixin) ) {
      mixinSymbols.set(mixin, Symbol())
    }

    const mixinSymbol = mixinSymbols.get(mixin)
    const application = mixin(classHierarchy)
    let prototype = application.prototype

    // Define hasInstance one time per mixin
    if( !Object.hasOwn(mixin, Symbol.hasInstance) ) {
      Object.defineProperty(mixin, Symbol.hasInstance, {
        // Use mixin reference as test value for instanceof support
        value: instance => mixin === instance[mixinSymbol]
      })
    }

    // Allow only one application of the mixin per hierarchy
    while( prototype !== null ) {
      if( Object.hasOwn(prototype, mixinSymbol) ) {
        break;
      }
      prototype = Object.getPrototypeOf(prototype)
    }

    if( prototype === null ) {
      // Set mixin reference for hasInstance test
      Object.defineProperty(application.prototype, mixinSymbol, {
        value: mixin
      })
      return application
    } else {
      return classHierarchy
    }

  }, superclass)
}

export { superclassWithMixins }

