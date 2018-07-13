const flatten = (xs, ys) => xs.concat(ys)
const uniqueFilter = (val, index, array) => array.indexOf(val) === index

function createTimestampFromDataset(dataset) {
  return new Date(dataset.timestamp.s * 1000 + dataset.timestamp.us / 1000)
}

export {
  flatten,
  uniqueFilter,
  createTimestampFromDataset
}
