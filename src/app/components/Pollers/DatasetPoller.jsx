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
      const missing = queries.filter(q => !state.contextDatasets.some(c => matchesTarget(c.target, q.target)))
      const newEntries = missing.map(q => ({ target: q.target, datasets: [], instanceDomainMappings: {} }))
      if (newEntries.length === 0) return null
      return { contextDatasets: state.contextDatasets.concat(newEntries) }
    })
  }

  findMetricNames = (chart) => {
    // scan context data to map the pmids, return pmids[]
    const context = this.props.contextData.find(ctx => matchesTarget(ctx.target, chart.context.target))

    if (!context || !context.pmids) {
      console.warn('could not find pmids for chart', chart)
      return []
    }

    return chart.processor.requiredMetricNames(chart)
  }

  pollMetrics = async () => {
    try {
      if (this.props.charts.length == 0) {
        return
      }

      // collect tuples[]: { hostname, contextId, pmids[] }
      const singleQueries = this.props.charts.map(chart => ({
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
          .filter(pmid => pmid !== null).join(',')
        // TODO should be able to alarm if we can't find any pmids to match?

        let res = await superagent
          .get(`http://${q.target.hostname}/pmapi/${q.contextId}/_fetch`)
          .query({ pmids })
        const oldestS = res.body.timestamp.s - (this.props.windowIntervalMs / 1000)

        // use setState to stick the data into state and then publish up the completed dataset
        this.setState(state => {
          // ensure there is a place to put the data
          let newContextDatasets = [...state.contextDatasets]
          let cdsIndex = newContextDatasets.findIndex(cds => matchesTarget(cds.target, q.target))
          newContextDatasets[cdsIndex].datasets = newContextDatasets[cdsIndex].datasets
            .concat(res.body)
            .filter(ds => ds.timestamp.s >= oldestS)

          this.props.onContextDatasetsUpdated(newContextDatasets)
          return { contextDatasets: newContextDatasets }
        })
      }

      // find any missing instanceDomainMappings
      // TODO how do we poll this regularly for updates? eg: bcc tcptop, changing socket list
      for(const q of queries) {
        const idomMaps = this.state.contextDatasets.find(cds => matchesTarget(cds.target, q.target)).instanceDomainMappings
        const neededNames = q.metricNames.filter(name => !(name in idomMaps))

        for(const name of neededNames) {
          const newMapping = {}
          try {
            let res = await superagent
              .get(`http://${q.target.hostname}/pmapi/${q.contextId}/_indom`)
              .query({ name })
            res.body.instances.forEach(({ instance, name }) => newMapping[instance] = name)
          } catch (err) {
            console.warn('could not poll for instance domain mapping', err)
            console.log(err)
          }

          this.setState(state => {
            let newContextDatasets = [...state.contextDatasets] // copy datasets
            let cdsIndex = newContextDatasets.findIndex(cds => matchesTarget(cds.target, q.target))
            newContextDatasets[cdsIndex].instanceDomainMappings = { ...newContextDatasets[cdsIndex].instanceDomainMappings, [name]: newMapping }

            this.props.onContextDatasetsUpdated(newContextDatasets)
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
}

export default DatasetPoller
