import { superclassWithMixins } from './mixins'
import { inspect } from 'util'

describe('Mixins', () => {

  it('should export the function `superclassWithMixins`', function() {
    expect(superclassWithMixins).toEqual(expect.any(Function))
  })

  describe('superclassWithMixins()', () => {

    it('should return the provided superclass', () => {
      const TestClass = class {}

      expect(superclassWithMixins(TestClass)).toBe(TestClass)
    })

    it('should extend the provided superclass given a proper mixin factory', () => {
      const TestClass = class {}
      const Mixin = superclass => class extends superclass {}
      const MixinExtendingSuperclass = superclassWithMixins(TestClass, Mixin)

      expect(Object.getPrototypeOf(MixinExtendingSuperclass)).toBe(TestClass)
    })

    it('should extend the provided superclass given multiple mixins in proper order', () => {
      const TestClass = class {}
      const Mixin1 = superclass => class Mixin1 extends superclass {}
      const Mixin2 = superclass => class Mixin2 extends superclass {}
      const Mixin3 = superclass => class Mixin3 extends superclass {}
      const Subclass = class extends superclassWithMixins(TestClass, Mixin1, Mixin2, Mixin3) {}
      const prototype1 = Object.getPrototypeOf(Subclass)
      const prototype2 = Object.getPrototypeOf(prototype1)
      const prototype3 = Object.getPrototypeOf(prototype2)

      expect(inspect(prototype1)).toBe('[class Mixin3 extends Mixin2]')
      expect(inspect(prototype2)).toBe('[class Mixin2 extends Mixin1]')
      expect(inspect(prototype3)).toBe('[class Mixin1 extends TestClass]')
    })

    describe('instances', () => {

      it('should support `instanceof` operator for applied mixins', () => {
        const TestClass = class {}
        const Mixin1 = superclass => class extends superclass {}
        const Mixin2 = superclass => class extends superclass {}
        const Mixin3 = superclass => class extends superclass {}
        const Subclass1 = class extends superclassWithMixins(TestClass, Mixin1, Mixin2) {}
        const Subclass2 = class extends superclassWithMixins(TestClass, Mixin3) {}

        expect(new Subclass1 instanceof Mixin1).toBe(true)
        expect(new Subclass1 instanceof Mixin2).toBe(true)
        expect(new Subclass1 instanceof Mixin3).toBe(false)
        expect(new Subclass2 instanceof Mixin1).toBe(false)
        expect(new Subclass2 instanceof Mixin2).toBe(false)
        expect(new Subclass2 instanceof Mixin3).toBe(true)
      })

      it('should not duplicate applied mixins in hierarchies', () => {
        const TestClass = class {}
        const Mixin1 = superclass => class extends superclass {}
        const Mixin2 = superclass => class extends superclass {}
        const Mixin3 = superclass => class extends superclass {}
        const Subclass1 = class extends superclassWithMixins(TestClass, Mixin1, Mixin2) {}
        const Subclass2 = class extends superclassWithMixins(Subclass1, Mixin1, Mixin2) {}
        const Subclass3 = class extends superclassWithMixins(Subclass2, Mixin3) {}

        expect(Object.getPrototypeOf(Subclass2)).toBe(Subclass1)
        expect(Object.getPrototypeOf(Subclass3)).not.toBe(Subclass2)
        expect(Object.getPrototypeOf(Object.getPrototypeOf(Subclass3))).toBe(Subclass2)
      })
    })
  })
})
