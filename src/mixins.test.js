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
      const applyFn = jest.fn(({
        application,
        classHierarchy,
        mixin,
        mixins,
        mixinSymbol,
        mixinSymbols,
        superclass
      }) => application)
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

      expect(applyFn.mock.calls[0][0].mixin).toBe(Mixin1)
      expect(applyFn.mock.calls[1][0].mixin).toBe(Mixin2)
      expect(applyFn.mock.calls[2][0].mixin).toBe(Mixin3)

      expect(applyFn.mock.calls[0][0].mixins).toEqual([Mixin1, Mixin2, Mixin3])
      expect(applyFn.mock.calls[1][0].mixins).toEqual([Mixin1, Mixin2, Mixin3])
      expect(applyFn.mock.calls[2][0].mixins).toEqual([Mixin1, Mixin2, Mixin3])

      expect(prototype3.prototype[applyFn.mock.calls[0][0].mixinSymbol]).toBe(Mixin1)
      expect(prototype2.prototype[applyFn.mock.calls[1][0].mixinSymbol]).toBe(Mixin2)
      expect(prototype1.prototype[applyFn.mock.calls[2][0].mixinSymbol]).toBe(Mixin3)

      expect([
        applyFn.mock.calls[0][0].mixinSymbol,
        applyFn.mock.calls[1][0].mixinSymbol,
        applyFn.mock.calls[2][0].mixinSymbol
      ]).toEqual([
        applyFn.mock.calls[0][0].mixinSymbols.get(Mixin1),
        applyFn.mock.calls[1][0].mixinSymbols.get(Mixin2),
        applyFn.mock.calls[2][0].mixinSymbols.get(Mixin3)
      ])

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

  describe('Examples', () => {

    it('should support a caching feature by extension', () => {
      const cacheMixinApps = ({ application, classHierarchy, mixinSymbol, superclass }) => {
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

      const TestClass1 = class {}
      const TestClass2 = class {}
      const Mixin1 = superclass => class Mixin1 extends superclass {}
      const Mixin2 = superclass => class Mixin2 extends superclass {}
      const Mixin3 = superclass => class Mixin3 extends superclass {}
      const Subclass1 = class extends myMixins(TestClass1, Mixin1, Mixin2, Mixin3) {}
      const Subclass2 = class extends myMixins(TestClass1, Mixin1, Mixin2, Mixin3) {}
      const Subclass3 = class extends myMixins(TestClass1, Mixin3, Mixin1, Mixin2) {}
      const Subclass4 = class extends myMixins(TestClass2, Mixin3, Mixin1, Mixin2) {}
      const Subclass5 = class extends myMixins(TestClass2, Mixin3, Mixin1, Mixin2) {}
      const prototypeS11 = Object.getPrototypeOf(Subclass1)
      const prototypeS12 = Object.getPrototypeOf(prototypeS11)
      const prototypeS13 = Object.getPrototypeOf(prototypeS12)
      const prototypeS21 = Object.getPrototypeOf(Subclass2)
      const prototypeS22 = Object.getPrototypeOf(prototypeS21)
      const prototypeS23 = Object.getPrototypeOf(prototypeS22)
      const prototypeS31 = Object.getPrototypeOf(Subclass3)
      const prototypeS32 = Object.getPrototypeOf(prototypeS31)
      const prototypeS33 = Object.getPrototypeOf(prototypeS32)
      const prototypeS41 = Object.getPrototypeOf(Subclass4)
      const prototypeS42 = Object.getPrototypeOf(prototypeS41)
      const prototypeS43 = Object.getPrototypeOf(prototypeS42)
      const prototypeS51 = Object.getPrototypeOf(Subclass5)
      const prototypeS52 = Object.getPrototypeOf(prototypeS51)
      const prototypeS53 = Object.getPrototypeOf(prototypeS52)

      expect(prototypeS41).toBe(prototypeS51)
      expect(prototypeS42).toBe(prototypeS52)
      expect(prototypeS43).toBe(prototypeS53)
      expect(prototypeS41).not.toBe(prototypeS31)
      expect(prototypeS42).not.toBe(prototypeS32)
      expect(prototypeS43).not.toBe(prototypeS33)
      expect(prototypeS21).not.toBe(prototypeS31)
      expect(prototypeS22).not.toBe(prototypeS32)
      expect(prototypeS23).not.toBe(prototypeS33)
      expect(prototypeS11).toBe(prototypeS21)
      expect(prototypeS12).toBe(prototypeS22)
      expect(prototypeS13).toBe(prototypeS23)
    })
  })
})
