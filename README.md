# Patterns
https://0x59.github.io/patterns/
## Mixins
### withMixins()
- A function that provides basic mixin application for the provided superclass
- Mixin applications form a class hierarchy extending the superclass
#### Example
```JavaScript
    class Superclass {}

    const Mixin1 = superclass => class extends superclass {}
    const Mixin2 = superclass => class extends superclass {}

    class Subclass extends withMixins(Superclass, Mixin1, Mixin2) {}
    // superclass <= Mixin1 <= Mixin2 <= Subclass // class hierarchy
```
- Mixin applications that already exist in the class hierarchy are not duplicated
- Support for the `instanceof` operator is provided by testing against the mixin
  - `new Subclass instanceof Mixin1 // true`
- No mixin application caching is performed
### withMixinsA()
- An experimental function to offer feature extension during the application process
#### Examples
```JavaScript
    const cacheMixinApps = ({ application, classHierarchy, mixinSymbol }) => {
      if( !classHierarchy[mixinSymbol] ) {
        classHierarchy[mixinSymbol] = application
      }

      return classHierarchy[mixinSymbol]
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
