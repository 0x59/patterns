/** @module Symbol Registry */

/**
 * Creates a symbol registry wrapped by a proxy that uniquely and persistently maps keys (object properties) to symbols
 * @func Symbols
 * @return {object} New symbol registry that returns a new symbol when accessing a new property, or an existing symbol when accessing an existing property
 */
export const Symbols = () => {
  return new Proxy({}, {
    get(registry, name) {
      return registry[name] || ( registry[name] = Symbol(name) )
    }
  })
}
