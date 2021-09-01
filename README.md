# Patterns
## Mixins
### superclassWithMixins()
- A function that provides basic mixin application for the provided superclass using ES6 class expressions
- Mixin applications form a mixin class hierarchy through the reduction of a series of factories that return named and parameterized class expressions extending a superclass
```JavaScript
    const Mixin1 = superclass => class Mixin1 extends superclass {...}
    const Mixin2 = superclass => class Mixin2 extends superclass {...}
    class Subclass extends superclassWithMixins(Superclass, Mixin1, Mixin2) {...}
    // Superclass <= Mixin1 <= Mixin2 <= Subclass
```
- Mixin applications that already exist in the class hierarchy are not duplicated
- Support for the `instanceof` operator is provided by testing against the mixin factory
  - `new Subclass instanceof Mixin1 // true`
- No mixin application caching is performed
