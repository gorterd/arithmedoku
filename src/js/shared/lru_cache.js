const newNode = (options) => ({
  key: null,
  value: null,
  prev: null,
  next: null,
  lastUpdated: new Date(),
  ...options,
})

export default class LRUCache {
  constructor(max, timeBeforeClear = null) {
    this.max = max
    this.head = newNode()
    this.tail = newNode()
    this.timeBeforeClear = timeBeforeClear

    setInterval(() => {
      this._removeBefore(this.timeBeforeClear)
    }, 10000)

    this.reset()
  }

  get(key) {
    const node = this.map[key]
    if (node) node.lastUpdated = new Date()
    return node?.value
  }

  set(key, value) {
    const previousLast = this.tail.prev

    const node = newNode({
      key,
      value,
      prev: previousLast,
      next: this.tail
    })

    previousLast.next = node
    this.tail.prev = node

    this.size++
    if (this.size > this.max) this._removeOldest()

    this.map[key] = node
    return node?.value
  }

  remove(key) {
    const node = this.map[key]
    return this._remove(node)
  }

  reset() {
    this.map = {}
    this.size = 0

    this.head.next = this.tail
    this.tail.prev = this.head
  }

  _remove(node) {
    if (node && node !== this.head && node !== this.tail) {
      const { prev: beforeNode, next: afterNode } = node
      beforeNode.next = afterNode
      afterNode.prev = beforeNode
      this.size--

      delete this.map[node.key]
    }

    return node?.value
  }

  _removeOldest() {
    const oldest = this.head.next
    return this._remove(oldest)
  }

  _removeBefore(ms) {
    if (!ms) return

    const now = new Date()
    const newMap = {}
    let validNode = this.head

    while (
      validNode.next !== this.tail
      && (now - validNode.next.lastUpdated) < ms
    ) {
      validNode = validNode.next
      newMap[validNode.key] = validNode
    }

    validNode.next = this.tail
    this.tail.prev = validNode
    this.map = newMap
  }
}