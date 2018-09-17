/**!
 *
 *  Copyright 2018 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */

export function transformRawDataToPipelineData (datasets, chartInfo) {
  // quick clean loops
  const passMetrics = chartInfo.metricNames

  let output = []
  for(const { timestamp, values } of datasets) {
    const ts = new Date(timestamp.s * 1000 + timestamp.us / 1000)

    // TODO this is a hot loop, some different data access especially output.find() will probably improve things greatly
    for (const { name, instances } of values) {
      if (!passMetrics.includes(name)) continue

      for (const { instance, value } of instances) {
        if (value === null) continue

        // ensure there is a metric inside the instance
        let mi = output.find(e => e.metric === name && e.instance === instance)
        if (!mi) {
          mi = { metric: name, instance, data: [] }
          output.push(mi)
        }

        // and put the data in there
        mi.data.push({ ts, value })
      }
    }
  }

  return output
}

export function getLargestValueInDataset (dataset) {
  let max = -Number.MAX_VALUE
  if (!dataset) return undefined

  for (let d of dataset) {
    for (let tsv of d.data) {
      max = Math.max(max, tsv.value)
    }
  }
  return (max === -Number.MAX_VALUE) ? undefined : max
}

