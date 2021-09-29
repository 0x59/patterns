# Patterns
https://0x59.github.io/patterns/
## Mixins
### withMixins()
- A function that provides basic mixin application for the provided superclass using ES2015 class expressions
- Mixin applications form a mixin class hierarchy through the reduction of a series of factories that return parameterized (and optionally named) class expressions extending a superclass
#### Example
```JavaScript
    class Superclass {}

    const Mixin1 = superclass => class extends superclass {}
    const Mixin2 = superclass => class extends superclass {}

    class Subclass extends withMixins(Superclass, Mixin1, Mixin2) {}
    // class hierarchy: superclass <= Mixin1 <= Mixin2 <= Subclass
```
- Mixin applications that already exist in the class hierarchy are not duplicated
- Support for the `instanceof` operator is provided by testing against the mixin factory
  - `new Subclass instanceof Mixin1 // true`
- No mixin application caching is performed
### withMixinsA()
#### Examples
```JavaScript
    const cacheMixinApps = ({ application, classHierarchy, mixinSymbol }) => {
      if( !classHierarchy[mixinSymbol] ) {
        classHierarchy[mixinSymbol] = new Map()
      }

      const cache = classHierarchy[mixinSymbol]

      if( cache.has(classHierarchy) ) {
        return cache.get(classHierarchy)

      } else {
        cache.set(classHierarchy, application)
      }

      return application
    }
    const myMixins = (superclass, ...mixins) => withMixinsA(superclass, mixins, [cacheMixinApps])

    class Superclass {}

    const Mixin1 = superclass => class extends superclass {}
    const Mixin2 = superclass => class extends superclass {}

    class Subclass1 extends myMixins(Superclass, Mixin1, Mixin2) {}
    class Subclass2 extends myMixins(Superclass, Mixin1, Mixin2) {}
    // Object.getPrototypeOf(Subclass1) === Object.getPrototypeOf(Subclass2) // true
```
- However, note the same effect is achieved by saving and reusing the applications directly
```JavaScript
    class Superclass {}

    const Mixin1 = superclass => class extends superclass {}
    const Mixin2 = superclass => class extends superclass {}
    const Hierarchy = withMixins(Superclass, Mixin1, Mixin2)

    class Subclass1 extends Hierarchy {}
    class Subclass2 extends Hierarchy {}
    // Object.getPrototypeOf(Subclass1) === Object.getPrototypeOf(Subclass2) // true
```
