export class RingBuffer {

  static #empty = Symbol()
  static get empty() {
    return RingBuffer.#empty
  }

  #head
  #items
  #size
  #maxSize
  #tail

  constructor(maxSize = -1) {
    this.#head = 0
    this.#items = new Array(maxSize)
    this.#maxSize = maxSize
    this.#size = 0
    this.#tail = 0
  }

  isEmpty = () => this.#size === 0

  isFull = () => this.#size === this.#maxSize

  read = () => {
    let item = RingBuffer.empty

    if (!this.isEmpty()) {
      item = this.#read()
      this.#moveTail()
      --this.#size
    }

    return item
  }

  readAll = fn => {
    while (!this.isEmpty()) {
      fn(this.#read())
      this.#moveTail()
      --this.#size
    }
  }

  size = () => this.#size

  write = item => {
    this.#write(item)
    this.#moveHead()

    this.isFull()
      ? this.#moveTail()
      : ++this.#size
  }

  #moveHead = () => this.#head = ++this.#head % this.#maxSize

  #moveTail = () => this.#tail = ++this.#tail % this.#maxSize

  #read = () => this.#items[this.#tail]

  #write = item => this.#items[this.#head] = item

}
