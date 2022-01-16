export function makeTypeValues() {
  return [
    ['array', []],
    ['bigint', 0n],
    ['boolean', true],
    ['function', () => {}],
    ['null', null],
    ['number', 0],
    ['object', {}],
    ['string', ''],
    ['symbol', Symbol()],
    ['undefined', void 0]
  ]
}

export function expectTypeTestsToBe({fn, result, not = false}, ...typeNames) {
  const types = makeTypeValues().filter(
    ([name]) => not ? !typeNames.includes(name) : typeNames.includes(name)
  )

  types.forEach(([, value]) => {
    expect(fn(value)).toBe(result)
  })
}

export function expectAllTypeTestsExceptToBe({fn, result}, ...typeNames) {
  return expectTypeTestsToBe({fn, result, not: true}, ...typeNames)
}
