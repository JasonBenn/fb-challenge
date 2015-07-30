import test from 'tape'

const rangeCovers = (rangeBegin, rangeEnd, value) => (rangeBegin <= value && value < rangeEnd)
const overlap = (a, b) => rangeCovers(a.start, a.end, b.start) || rangeCovers(b.start, b.end, a.start)


test('overlap', (t) => {
  const testCases = [
    [{start: 0, end: 60}, {start: 30, end: 90}, true],
    [{start: 30, end: 90}, {start: 0, end: 60}, true],
    [{start: 0, end: 60}, {start: 0, end: 60}, true],
    [{start: 0, end: 60}, {start: 60, end: 120}, false],
    [{start: 60, end: 120}, {start: 0, end: 60}, false],
    [{start: 0, end: 60}, {start: 90, end: 120}, false],
    [{start: 90, end: 120}, {start: 0, end: 60}, false],
  ]

  t.plan(testCases.length)

  testCases.forEach(([a, b, result]) => {
    t.equal(overlap(a, b), result, `${JSON.stringify(a)} and ${JSON.stringify(b)}`)
  })
})
