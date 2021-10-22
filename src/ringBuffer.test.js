import * as Module from './ringBuffer'
import {
  RingBuffer
} from './ringBuffer'
import { jest } from '@jest/globals'

describe('RingBuffer', () => {

  it('exports correct module interface', () => {
    const expected = {
      RingBuffer: expect.any(Function)
    }

    expect(Object.keys(Module).sort()).toEqual(Object.keys(expected).sort())
    expect(Module).toEqual(expect.objectContaining(expected))
  })

  describe('RingBuffer()', () => {

    it('requires `size` argument', () => {
      expect(() => new RingBuffer).toThrow()
      expect(() => new RingBuffer(4)).not.toThrow()
    })

    it('has read-only empty value', () => {
      expect(() => RingBuffer.empty = 'test').toThrow()
      expect(RingBuffer.empty).not.toBe(void 0)
    })

    it('returns empty value when empty', () => {
      const b = new RingBuffer(4)

      expect(b.read()).toBe(RingBuffer.empty)
    })

    it('writes and reads one item', () => {
      const b = new RingBuffer(4)
      const testItem = {}

      b.write(testItem)
      expect(b.read()).toBe(testItem)
    })

    it('writes and reads `size` items', () => {
      const b = new RingBuffer(4)
      const testItems = [{}, {}, {}, {}]
      let readItems = []

      testItems.forEach(item => b.write(item))
      b.readAll(item => readItems.push(item))

      expect(readItems).toEqual(testItems)
    })

    it('reads last `size` items', () => {
      const size = 4
      const b = new RingBuffer(size)
      const testItems = [{}, {}, {}, {}, {}, {}]
      let readItems = []

      testItems.forEach(item => b.write(item))
      b.readAll(item => readItems.push(item))

      expect(readItems).toEqual(testItems.slice(testItems.length - size))
    })
  })
})
