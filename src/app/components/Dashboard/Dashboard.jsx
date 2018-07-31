import React from 'react'
import PropTypes from 'prop-types'
import superagent from 'superagent'

import { SortableContainer, SortableElement } from 'react-sortable-hoc'

import Chart from '../Chart/Chart.jsx'
import { flatten } from '../../processors/utils'

const SortableChart = SortableElement(props => <li style={{ listStyle: 'none', display: 'inline-block', margin: '6px 6px 6px 6px' }}><Chart {...props}/></li>)

const SortableDashboard = SortableContainer(({ state, props }) => {
  return (
    <div style={{ paddingLeft: '15px' }}>
      Status: { state.status }<br />
      Context: { state.context }<br />
      <ul>
        { props.chartlist.map((c, idx) => {
          return <SortableChart
            key={`chart-${idx}`}
            index={idx}
            chartInfo={c}
            datasets={state.datasets}
            onCloseClicked={() => props.removeChartByIndex(idx)}
            containerList={state.containerList}
            instanceDomainMappings={state.instanceDomainMappings}
            containerId={(props.settings.containerId || '_all') === '_all' ? '' : props.settings.containerId}
            settings={c.settings}
            onNewSettings={(settings) => props.updateChartSettings(idx, settings)}
            // TODO need a better way to pass this pmid list in to the settings dialogs
            pmids={state.pmids}/>
        })}
      </ul>
    </div>
  )
})

export class Dashboard extends React.Component {
  state = {
    context: null,
    status: 'Initializing',
    pmids: [],
    datasets: [],
    instanceDomainMappings: {},
    containerList: [],
  }

  componentDidMount() {
    this.startContext()
  }

  // TODO status updates should be calculated from state and properties, not at runtime
  // TODO pmweb component interactions should be moved to a separate module

  componentDidUpdate(prevProps /*, prevState, snapshot */) {
    // if hostname or hostspec has changed, we need to tear down and set up a new context
    if (this.props.host.hostname !== prevProps.host.hostname
      || this.props.host.hostspec !== prevProps.host.hostspec) {
      this.setState({ datasets: [] })
      this.startContext()
    }
    if (this.props.settings.containerId !== prevProps.settings.containerId) {
      this.selectContainer()
    }
  }

  async selectContainer() {
    this.setState({ status: `Connected to ${this.props.host.hostname}/${this.props.host.hostspec} - selecting container` })
    let newContainerId = this.props.settings.containerId
    if (newContainerId === '_all') {
      newContainerId = ''
    }
    try {
      let host = `http://${this.props.host.hostname}:7402`
      await superagent
        .get(`${host}/pmapi/${this.state.context}/_store`)
        .query({ name: 'pmcd.client.container', value: newContainerId })

      this.setState({ status: `Connected to ${this.props.host.hostname}/${this.props.host.hostspec} - ${newContainerId}` })
    } catch (err) {
      this.setState({ status: `Connected to ${this.props.host.hostname}/${this.props.host.hostspec} - could not select container, ${err.message}` })
    }
  }

  /**
   * Connects to the PMWEB context and then starts the poll timer
   */
  async startContext() {
    this.setState({ status: `Connecting to ${this.props.host.hostname}/${this.props.host.hostspec}` })

    try {
      let host = `http://${this.props.host.hostname}:7402`

      let res = await superagent
        .get(`${host}/pmapi/context`)
        .query({ exclusive: 1, hostspec: this.props.host.hostspec, polltimeout: 600 })
      let context = res.body.context

      this.setState({ status: 'Fetching PMIDs' })
      res = await superagent.get(`${host}/pmapi/${context}/_metric`)
      this.setState({ pmids: res.body.metrics.map(m => { return {name: m.name, pmid: m.pmid} }) })

      this.setState({ status: 'Fetching hostname' })
      res = await superagent.get(`${host}/pmapi/${context}/_fetch?names=pmcd.hostname`)
      let hostname = res.body.values[0].instances[0].value

      // TODO what is the trigger for fetching new container names, as they start and stop?
      this.setState({ status: 'Fetching container names' })
      res = await superagent.get(`${host}/pmapi/${context}/_fetch?names=containers.name`)
      let containers = res.body.values[0].instances
      res = await superagent.get(`${host}/pmapi/${context}/_fetch?names=containers.cgroup`)
      let cgroups = res.body.values[0].instances
      let containerList = cgroups.map(({ instance, value }) => ({
        instance,
        cgroup: value,
        containerId: containers.find(cont => cont.instance === instance).value
      }))
      this.setState({ containerList })
      this.props.onContainerListLoaded(containerList)

      // set context as last thing we do, this is the flag that we are connected
      this.setState({ context })
      this.setState({ status: `Connected to ${hostname}/${this.props.host.hostspec}` })

      // do it
      setTimeout(this.pollMetrics, this.props.settings.intervalSeconds * 1000)
    } catch (err) {
      this.setState({ status: `Disconnected (${err.message})`, pmids: [], context: null })
    }
  }

  /**
   * Polls the endpoint for metrics
   */
  pollMetrics = async () => {
    try {
      // collect pmids to fetch
      if (this.props.chartlist.length > 0) {
        let uniqueMetrics = this.props.chartlist
          .map((c) => c.processor.requiredMetricNames(c)) // extract only the metric names we need
          .filter(val => !!val) // check a valid metric name came back
          .reduce(flatten, []) // flatten the array
          .filter((val, index, array) => array.indexOf(val) === index) // keep only one instance of an object ie: make it unique

        let uniquePmids = this.state.pmids.filter((pmid) => uniqueMetrics.includes(pmid.name)) // collect all pmids where the name matches
          .map((pmid) => pmid.pmid) // extract the pmid
          .join(',') // concatenate to string

        // do a fetch
        let host = `http://${this.props.host.hostname}:7402`
        let res = await superagent
          .get(`${host}/pmapi/${this.state.context}/_fetch`)
          .query({ pmids: uniquePmids })

        this.setState((state) => {
          // we want a WINDOW of x seconds, which means we need from latest to newest, we will assume the most recent is newest
          const oldestS = res.body.timestamp.s - this.props.settings.windowSeconds
          // new dataset is ... all the old stuff, plus the new one, without anything with an old timestamp
          const newDatasets = [ ...state.datasets, res.body ]
            .filter(ds => ds.timestamp.s >= oldestS)
          return { datasets: newDatasets }
        })

        // determine needed new mappings
        // TODO what is the trigger for re-polling a given value if we can't map it?
        let neededNewMappings = uniqueMetrics.filter(metricName => !(metricName in this.state.instanceDomainMappings))
        neededNewMappings.forEach(async name => {
          const newMapping = {}
          try {
            let res = await superagent
              .get(`${host}/pmapi/${this.state.context}/_indom`)
              .query({ name })
            res.body.instances.forEach(({ instance, name }) => newMapping[instance] = name)
          } catch (err) {
            console.error(`could not fetch _indom mapping for name=${name}`, err)
          }
          this.setState(state => {
            let newMappings = { ...state.instanceDomainMappings }
            newMappings[name] = newMapping
            return { instanceDomainMappings: newMappings }
          })
        })

      }
    } catch (err) {
      console.warn(err)
    }
    // go again
    setTimeout(this.pollMetrics, this.props.settings.intervalSeconds * 1000)
  }

  onSortEnd = ({ oldIndex, newIndex }) => this.props.onMoveChart(oldIndex, newIndex)

  render () {
    return <SortableDashboard state={this.state} props={this.props} onSortEnd={this.onSortEnd} useDragHandle={true} axis='xy'/>
  }
}

Dashboard.propTypes = {
  host: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  chartlist: PropTypes.array.isRequired,
  onContainerListLoaded: PropTypes.func.isRequired,
  removeChartByIndex: PropTypes.func.isRequired,
  updateChartSettings: PropTypes.func.isRequired,
  onMoveChart: PropTypes.func.isRequired,
}

export default Dashboard
