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

    it('requires `maxSize` constructor argument', () => {
      expect(() => new RingBuffer).toThrow()
      expect(() => new RingBuffer(4)).not.toThrow()
    })

    it('has static read-only `empty` value', () => {
      expect(() => RingBuffer.empty = 'test').toThrow()
      expect(RingBuffer.empty).not.toBe(void 0)
    })

    it('returns `empty` after initialized', () => {
      const b = new RingBuffer(4)

      expect(b.read()).toBe(RingBuffer.empty)
      expect(b.size()).toBe(0)
    })

    it('writes and reads one item', () => {
      const b = new RingBuffer(4)
      const testItem = {}

      b.write(testItem)
      expect(b.size()).toBe(1)
      expect(b.read()).toBe(testItem)
      expect(b.size()).toBe(0)
      expect(b.read()).toBe(RingBuffer.empty)
    })

    it('writes and reads `maxSize` items', () => {
      const b = new RingBuffer(4)
      const testItems = [{}, {}, {}, {}]
      let readItems = []

      testItems.forEach(item => b.write(item))

      expect(b.size()).toBe(testItems.length)

      b.readAll(item => readItems.push(item))

      expect(readItems).toEqual(testItems)
      expect(b.size()).toBe(0)
    })

    it('reads last `maxSize` items', () => {
      const maxSize = 4
      const b = new RingBuffer(maxSize)
      const testItems = [{}, {}, {}, {}, {}, {}]
      let readItems = []

      testItems.forEach(item => b.write(item))

      expect(b.size()).toBe(maxSize)

      b.readAll(item => readItems.push(item))

      expect(readItems).toEqual(testItems.slice(testItems.length - maxSize))
      expect(b.size()).toBe(0)
    })
  })
})
