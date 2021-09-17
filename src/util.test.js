import { prototypeChainHasOwn } from './index'

describe('Util', () => {

	it('should export function `prototypeChainHasOwn`', () => {
		expect(prototypeChainHasOwn).toEqual(expect.any(Function))
	})

  describe('prototypeChainHasOwn()', () => {

    it('should return `null` for non-objects', () => {
      expect(prototypeChainHasOwn('test')).toBe(null)
      expect(prototypeChainHasOwn(0)).toBe(null)
      expect(prototypeChainHasOwn(1n)).toBe(null)
      expect(prototypeChainHasOwn(true)).toBe(null)
      expect(prototypeChainHasOwn(void 0)).toBe(null)
      expect(prototypeChainHasOwn(null)).toBe(null)
      expect(prototypeChainHasOwn(Symbol())).toBe(null)
    })

    it('should return `null` for props other than strings and symbols', () => {
      expect(prototypeChainHasOwn({}, 0)).toBe(null)
      expect(prototypeChainHasOwn({}, 1n)).toBe(null)
      expect(prototypeChainHasOwn({}, true)).toBe(null)
      expect(prototypeChainHasOwn({}, void 0)).toBe(null)
      expect(prototypeChainHasOwn({}, null)).toBe(null)
    })

    it('should return `null` for non-existing props', () => {
      expect(prototypeChainHasOwn({}, 'test')).toBe(null)
      expect(prototypeChainHasOwn({}, Symbol('test'))).toBe(null)
    })

    it('should return the correct `.prototype` object', () => {
      const f1 = function() {}
      const f2 = function() {}
      const f3 = function() {}

      f1.prototype.key1 = {}
      f2.prototype.key2 = {}
      f3.prototype.key3 = {}
      Object.setPrototypeOf(f2, f1)
      Object.setPrototypeOf(f3, f2)

      expect(prototypeChainHasOwn(f3, 'key1').key1).toBe(f1.prototype.key1)
      expect(prototypeChainHasOwn(f3, 'key2').key2).toBe(f2.prototype.key2)
      expect(prototypeChainHasOwn(f3, 'key3').key3).toBe(f3.prototype.key3)
    })
  })
})
