Pseudocode for creating the tree:

REDUCE events
  FIND rowGroup that overlaps event
    FIND columnGroup that doesn't overlap event
      // a columnGroup doesn't overlap! Add the event to that columnGroup.
      columnGroup.push(event)
    ELSE
      // no columnGroups overlap event, create a new columnGroup.
      columnGroups.push([event])
  ELSE
    // no rowGroups overlap event, create a new rowGroup.
    rowGroups.push([[event]])
