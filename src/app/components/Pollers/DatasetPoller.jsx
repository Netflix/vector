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

import React from 'react'
import PropTypes from 'prop-types'
import superagent from 'superagent'
import { uniqueFilter, matchesTarget } from '../../utils'

import WorkerTimer from 'worker-loader!./DatasetPollerTimer.js'

class DatasetPoller extends React.Component {
  workerTimer = new WorkerTimer()

  state = {
    contextDatasets: [], // { hostname, contextId, datasets[], instanceDomainMappings{metric:{in->dom}} }
  }

  render () {
    return null
  }

  componentDidMount = () => {
    this.workerTimer.onmessage = this.pollMetrics
    this.workerTimer.postMessage({ interval: `${this.props.pollIntervalMs}` })
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.pollIntervalMs !== this.props.pollIntervalMs) {
      this.workerTimer.postMessage({ interval: `${this.props.pollIntervalMs}` })
    }
  }

  guaranteeDatasetsInStateForQueries = (queries) => {
    this.setState(state => {
      const { contextDatasets } = state
      const missing = queries.filter(q => !contextDatasets.some(c => matchesTarget(c.target, q.target)))
      const newEntries = missing.map(q => ({ target: q.target, datasets: [], instanceDomainMappings: {} }))
      if (newEntries.length === 0) return null
      return { contextDatasets: contextDatasets.concat(newEntries) }
    })
  }

  findMetricNames = (chart) => {
    const { contextData } = this.props
    // scan context data to map the pmids, return pmids[]
    const context = contextData.find(ctx => matchesTarget(ctx.target, chart.context.target))

    if (!context || !context.pmids) {
      console.warn('could not find pmids for chart', chart)
      return []
    }

    return chart.processor.requiredMetricNames(chart)
  }

  pollMetrics = async () => {
    const { charts, protocol, windowIntervalMs, onContextDatasetsUpdated } = this.props
    const { contextDatasets = [] } = this.state
    try {
      if (charts.length == 0) {
        return
      }

      // collect tuples[]: { hostname, contextId, pmids[] }
      const singleQueries = charts.map(chart => ({
        target: chart.context.target,
        contextId: chart.context.contextId,
        context: chart.context,
        metricNames: this.findMetricNames(chart),
      }))

      // merge tuple pmids, so we only run a single fetch per host
      const queries = singleQueries.reduce((acc, query) => {
        const existingQuery = acc.find(q => matchesTarget(q.target, query.target))
        if (existingQuery) {
          existingQuery.metricNames = existingQuery.metricNames
            .concat(query.metricNames)
            .filter(uniqueFilter)
        } else {
          // copy as this is it is mutated during later reduce iterations
          acc.push({
            target: query.target,
            contextId: query.contextId,
            context: query.context,
            metricNames: query.metricNames,
          })
        }
        return acc
      }, [])

      this.guaranteeDatasetsInStateForQueries(queries)

      // connect to hostname&context, query pmids
      for(const q of queries) {
        let pmids = q.metricNames.map(n => q.context.pmids[n] || null)
          .filter(pmid => pmid !== null)
          .join(',')
        // TODO should be able to alarm if we can't find any pmids to match?

        let res = await superagent
          .get(`${protocol}://${q.target.hostname}/pmapi/${q.contextId}/_fetch`)
          .query({ pmids })
        const oldestS = res.body.timestamp.s - (windowIntervalMs / 1000)

        // use setState to stick the data into state and then publish up the completed dataset
        this.setState(state => {
          // ensure there is a place to put the data
          let newContextDatasets = [...state.contextDatasets]
          let cdsIndex = newContextDatasets.findIndex(cds => matchesTarget(cds.target, q.target))
          newContextDatasets[cdsIndex].datasets = newContextDatasets[cdsIndex].datasets
            .concat(res.body)
            .filter(ds => ds.timestamp.s >= oldestS)

          onContextDatasetsUpdated(newContextDatasets)
          return { contextDatasets: newContextDatasets }
        })
      }

      // find any missing instanceDomainMappings
      // TODO how do we poll this regularly for updates? eg: bcc tcptop, changing socket list
      for(const q of queries) {
        const context = contextDatasets.find(cds => matchesTarget(cds.target, q.target))
        // make sure we have a context that is valid
        if (!context) {
          continue;
        }

        const idomMaps = context.instanceDomainMappings
        const neededNames = q.metricNames.filter(name => !(name in idomMaps))

        for(const name of neededNames) {
          const newMapping = {}
          try {
            let res = await superagent
              .get(`${protocol}://${q.target.hostname}/pmapi/${q.contextId}/_indom`)
              .query({ name })
            res.body.instances.forEach(({ instance, name }) => newMapping[instance] = name)
          } catch (err) {
            console.warn('could not poll for instance domain mapping', err)
            console.log(err)
          }

          this.setState(state => {
            let newContextDatasets = [...state.contextDatasets] // copy datasets
            let cdsIndex = newContextDatasets.findIndex(cds => matchesTarget(cds.target, q.target))
            newContextDatasets[cdsIndex].instanceDomainMappings = {
              ...newContextDatasets[cdsIndex].instanceDomainMappings,
              [name]: newMapping
            }

            onContextDatasetsUpdated(newContextDatasets)
            return { contextDatasets: newContextDatasets }
          })
        }
      }
      // go again
    } catch (err) {
      console.warn('could not poll', err)
    }
  }
}

DatasetPoller.propTypes = {
  pollIntervalMs: PropTypes.number.isRequired,
  windowIntervalMs: PropTypes.number.isRequired,
  charts: PropTypes.arrayOf(
    PropTypes.shape({
      context: PropTypes.object.isRequired,
      processor: PropTypes.object.isRequired,
    })
  ),
  contextData: PropTypes.array.isRequired,
  onContextDatasetsUpdated: PropTypes.func.isRequired,
  protocol: PropTypes.string.isRequired,
}

export default DatasetPoller
