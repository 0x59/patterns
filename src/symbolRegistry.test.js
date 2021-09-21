import { Symbols } from './symbolRegistry'

describe('Symbol Registry', () => {

  it('should export function `Symbols`', () => {
    expect(Symbols).toEqual(expect.any(Function))
  })

  describe('Symbols()', () => {

    let $

    beforeEach(function() {
      $ = Symbols()
    })

    it('should return symbols when accessing arbitrary properties', () => {
      expect(typeof $.test1).toBe('symbol')
      expect(typeof $['test2']).toBe('symbol')
      let { test3 } = $
      expect(typeof test3).toBe('symbol')
    })

    it('should return the same symbols for subsequent property accesses', () => {
      expect($.test1).toBe($.test1)
      expect($['test2']).toBe($['test2'])
      let { test3, test3: test4 } = $
      expect(test3).toBe(test4)
    })
  })
})
