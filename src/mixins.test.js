import { withMixins, withMixinsA } from './mixins'
import { jest } from '@jest/globals'
import { inspect } from 'util'

describe('Mixins', () => {

  it('should export the function `withMixins`', function() {
    expect(withMixins).toEqual(expect.any(Function))
  })

  it('should export the function `withMixinsA`', function() {
    expect(withMixinsA).toEqual(expect.any(Function))
  })

  describe('withMixins()', () => {

    it('should return the superclass', () => {
      const TestClass = class {}

      expect(withMixins(TestClass)).toBe(TestClass)
    })

    it('should extend the superclass given a proper mixin factory', () => {
      const TestClass = class {}
      const Mixin = superclass => class extends superclass {}
      const MixinExtendingSuperclass = withMixins(TestClass, Mixin)

      expect(Object.getPrototypeOf(MixinExtendingSuperclass)).toBe(TestClass)
    })

    it('should extend the superclass given multiple mixins in proper order', () => {
      const TestClass = class {}
      const Mixin1 = superclass => class Mixin1 extends superclass {}
      const Mixin2 = superclass => class Mixin2 extends superclass {}
      const Mixin3 = superclass => class Mixin3 extends superclass {}
      const Subclass = class extends withMixins(TestClass, Mixin1, Mixin2, Mixin3) {}
      const prototype1 = Object.getPrototypeOf(Subclass)
      const prototype2 = Object.getPrototypeOf(prototype1)
      const prototype3 = Object.getPrototypeOf(prototype2)

      expect(inspect(prototype1)).toBe('[class Mixin3 extends Mixin2]')
      expect(inspect(prototype2)).toBe('[class Mixin2 extends Mixin1]')
      expect(inspect(prototype3)).toBe('[class Mixin1 extends TestClass]')
    })

    it('should support `instanceof` operator for applied mixins', () => {
      const TestClass = class {}
      const Mixin1 = superclass => class extends superclass {}
      const Mixin2 = superclass => class extends superclass {}
      const Mixin3 = superclass => class extends superclass {}
      const Subclass1 = class extends withMixins(TestClass, Mixin1, Mixin2) {}
      const Subclass2 = class extends withMixins(TestClass, Mixin3) {}

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
      const Subclass1 = class extends withMixins(TestClass, Mixin1, Mixin2) {}
      const Subclass2 = class extends withMixins(Subclass1, Mixin1, Mixin2) {}
      const Subclass3 = class extends withMixins(Subclass2, Mixin3) {}

      expect(Object.getPrototypeOf(Subclass2)).toBe(Subclass1)
      expect(Object.getPrototypeOf(Subclass3)).not.toBe(Subclass2)
      expect(Object.getPrototypeOf(Object.getPrototypeOf(Subclass3))).toBe(Subclass2)
    })
  })

  describe('withMixinsA()', () => {

    it('should return the superclass', () => {
      const TestClass = class {}

      expect(withMixinsA(TestClass)).toBe(TestClass)
    })

    it('should extend the superclass given a proper mixin factory', () => {
      const TestClass = class {}
      const Mixin = superclass => class extends superclass {}
      const MixinExtendingSuperclass = withMixinsA(TestClass, [Mixin])

      expect(Object.getPrototypeOf(MixinExtendingSuperclass)).toBe(TestClass)
    })

    it('should extend the superclass given multiple mixins in proper order', () => {
      const TestClass = class {}
      const Mixin1 = superclass => class Mixin1 extends superclass {}
      const Mixin2 = superclass => class Mixin2 extends superclass {}
      const Mixin3 = superclass => class Mixin3 extends superclass {}
      const Subclass = class extends withMixinsA(TestClass, [Mixin1, Mixin2, Mixin3]) {}
      const prototype1 = Object.getPrototypeOf(Subclass)
      const prototype2 = Object.getPrototypeOf(prototype1)
      const prototype3 = Object.getPrototypeOf(prototype2)

      expect(inspect(prototype1)).toBe('[class Mixin3 extends Mixin2]')
      expect(inspect(prototype2)).toBe('[class Mixin2 extends Mixin1]')
      expect(inspect(prototype3)).toBe('[class Mixin1 extends TestClass]')
    })

    it('should execute the apply function', () => {
      const applyFn = jest.fn(({ application }) => application)
      const TestClass = class {}
      const Mixin1 = superclass => class Mixin1 extends superclass {}
      const Mixin2 = superclass => class Mixin2 extends superclass {}
      const Mixin3 = superclass => class Mixin3 extends superclass {}
      const Subclass = class extends withMixinsA(TestClass, [Mixin1, Mixin2, Mixin3], [applyFn]) {}

      expect(applyFn).toHaveBeenCalledTimes(3) // mixin count
    })

    it('should provide the proper arguments to the apply function', () => {
      const applyFn = jest.fn(({ application, classHierarchy, mixinSymbol, superclass }) => application)
      const TestClass = class {}
      const Mixin1 = superclass => class Mixin1 extends superclass {}
      const Mixin2 = superclass => class Mixin2 extends superclass {}
      const Mixin3 = superclass => class Mixin3 extends superclass {}
      const Subclass = class extends withMixinsA(TestClass, [Mixin1, Mixin2, Mixin3], [applyFn]) {}
      const prototype1 = Object.getPrototypeOf(Subclass)
      const prototype2 = Object.getPrototypeOf(prototype1)
      const prototype3 = Object.getPrototypeOf(prototype2)

      expect(applyFn.mock.calls[0][0].application).toBe(prototype3)
      expect(applyFn.mock.calls[1][0].application).toBe(prototype2)
      expect(applyFn.mock.calls[2][0].application).toBe(prototype1)

      expect(applyFn.mock.calls[0][0].classHierarchy).toBe(TestClass)
      expect(applyFn.mock.calls[1][0].classHierarchy).toBe(prototype3)
      expect(applyFn.mock.calls[2][0].classHierarchy).toBe(prototype2)

      expect(prototype3.prototype[applyFn.mock.calls[0][0].mixinSymbol]).toBe(Mixin1)
      expect(prototype2.prototype[applyFn.mock.calls[1][0].mixinSymbol]).toBe(Mixin2)
      expect(prototype1.prototype[applyFn.mock.calls[2][0].mixinSymbol]).toBe(Mixin3)

      expect(applyFn.mock.calls[0][0].superclass).toBe(TestClass)
      expect(applyFn.mock.calls[1][0].superclass).toBe(TestClass)
      expect(applyFn.mock.calls[2][0].superclass).toBe(TestClass)
    })

    it('should support `instanceof` operator for applied mixins', () => {
      const TestClass = class {}
      const Mixin1 = superclass => class extends superclass {}
      const Mixin2 = superclass => class extends superclass {}
      const Mixin3 = superclass => class extends superclass {}
      const Subclass1 = class extends withMixinsA(TestClass, [Mixin1, Mixin2]) {}
      const Subclass2 = class extends withMixinsA(TestClass, [Mixin3]) {}

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
      const Subclass1 = class extends withMixinsA(TestClass, [Mixin1, Mixin2]) {}
      const Subclass2 = class extends withMixinsA(Subclass1, [Mixin1, Mixin2]) {}
      const Subclass3 = class extends withMixinsA(Subclass2, [Mixin3]) {}

      expect(Object.getPrototypeOf(Subclass2)).toBe(Subclass1)
      expect(Object.getPrototypeOf(Subclass3)).not.toBe(Subclass2)
      expect(Object.getPrototypeOf(Object.getPrototypeOf(Subclass3))).toBe(Subclass2)
    })
  })
})
