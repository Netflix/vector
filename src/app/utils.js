export function targetMatches (t1, t2) {
  return t1 && t2 && t1.hostname === t2.hostname && t1.hostspec === t2.hostspec && t1.containerId === t2.containerId
}

