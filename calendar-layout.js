import test from 'tape'
import { is, fromJS, List } from 'immutable'

// A calendar is an list of rowGroups, which each have full width and left of 0
const layOutEventTree = (eventTree, width = 120) => {
  return eventTree.flatMap(rowGroup => layOutRowGroup(rowGroup, width, 0))
}

// A rowGroup is a list of columnGroups, which share a rowGroups width and whose left steps up in increments
const layOutRowGroup = (rowGroup, width, left) => {
  const columnWidth = width / rowGroup.size
  return rowGroup.flatMap((columnGroup, i) => layOutColumnGroup(columnGroup, columnWidth, columnWidth * i))
}

// A columnGroup is a list of events, which are here assigned width and left properties.
const layOutColumnGroup = (columnGroup, width, left) => {
  return columnGroup.map(event => event.merge({ left, width }))
}



test('layOutEventTree', (t) => {
  const event = (start, end, width, left) => { return { start, end, width, left } }

  const testCases = [
    [[[[event(0, 60)]], [[event(90, 120)]]], [event(0, 60, 120, 0), event(90, 120, 120, 0)]],
    [[[[event(0, 60)], [event(0, 30), event(30, 60)]]], [event(0, 60, 60, 0), event(0, 30, 60, 60), event(30, 60, 60, 60)]],
    [[[[event(0, 45)], [event(15, 60)], [event(30, 75)]]], [event(0, 45, 40, 0), event(15, 60, 40, 40), event(30, 75, 40, 80)]],
  ]

  t.plan(testCases.length)

  testCases.forEach(([eventTree, expected]) => {
    // const description = `LAID OUT: ${JSON.stringify(layOutEventTree(fromJS(eventTree)))}
    //                      EXPECTED: ${JSON.stringify(expected)}`
    t.ok(is(layOutEventTree(fromJS(eventTree)), fromJS(expected)))//, description)
  })
})


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
