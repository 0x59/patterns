export class RingBuffer {

  static #empty = Symbol()
  static get empty() {
    return RingBuffer.#empty
  }

  #head
  #queue
  #size
  #tail

  constructor(size = -1) {
    this.#head = 0
    this.#queue = new Array(size).fill(RingBuffer.empty)
    this.#size = size
    this.#tail = 0
  }

  read = () => {
    let item

    if ((item = this.#read()) !== RingBuffer.empty) {
      this.#clearTail()
      this.#advanceTail()
    }

    return item
  }

  readAll = fn => {
    let item

    while ((item = this.#read()) !== RingBuffer.empty) {
      this.#clearTail()
      this.#advanceTail()
      fn(item)
    }
  }

  write = item => {
    if (this.#isOverrun()) {
      this.#advanceTail()
    }
    this.#write(item)
    this.#advanceHead()
  }

  #advanceHead = () => this.#head = (this.#head + 1) % this.#size

  #advanceTail = () => this.#tail = (this.#tail + 1) % this.#size

  #clearTail = () => this.#queue[this.#tail] = RingBuffer.empty

  #isOverrun = () => this.#queue[this.#head] !== RingBuffer.empty

  #read = () => this.#queue[this.#tail]

  #write = item => this.#queue[this.#head] = item

}
