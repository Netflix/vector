import superagent from 'superagent'

export function flatten (xs, ys) {
  return xs.concat(ys)
}

export function uniqueFilter (val, index, array) {
  return array.indexOf(val) === index
}

// use as a reducer
export function keyValueArrayToObjectReducer (obj, { key, value }) {
  obj[key] = value
  return obj
}

/////////////////////////////////////
export function targetMatches (t1, t2) {
  return t1 && t2 && t1.hostname === t2.hostname && t1.hostspec === t2.hostspec && t1.containerId === t2.containerId
}

/////////////////////////////////////

const PMAPI_POLL_TIMEOUT_SECONDS = 5

export async function fetchContainerList (hostname, hostport, hostspec) {
  // set up a new context, then fetch container and cgroup details
  const pmapi = `http://${hostname}:${hostport}/pmapi`

  let res = await superagent
    .get(`${pmapi}/context`)
    .query({ exclusive: 1, hostspec: hostspec, polltimeout: PMAPI_POLL_TIMEOUT_SECONDS })
  const context = res.body.context

  // need to do this second fetch and join to make sure we get genuine containers
  const promisedContainerNames = superagent.get(`${pmapi}/${context}/_fetch?names=containers.name`)
  const promisedCgroups = superagent.get(`${pmapi}/${context}/_fetch?names=containers.cgroup`)

  res = await promisedContainerNames
  const containers = res.body.values.length ? res.body.values[0].instances : []
  res = await promisedCgroups
  const cgroups = res.body.values.length ? res.body.values[0].instances : []

  const containerList = cgroups.map(({ instance, value }) => ({
    instance,
    cgroup: value,
    containerId: containers.find(cont => cont.instance === instance).value
  }))

  return containerList
}

