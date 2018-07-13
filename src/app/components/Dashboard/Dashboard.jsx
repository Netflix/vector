import React from 'react'
import PropTypes from 'prop-types'
import superagent from 'superagent'

import './dashboard.css'

import Chart from '../Chart/Chart.jsx'

const DEBUG_PMIDS = false

export class Dashboard extends React.Component {
  state = {
    context: null,
    status: 'Initializing',
    pmids: [],
    charts: [],
    datasets: []
  }

  componentDidMount() {
    this.startContext()
  }

  componentDidUpdate(prevProps /*, prevState, snapshot */) {
    // if hostname or hostspec has changed, we need to tear down and set up a new context
    if (this.props.host.hostname !== prevProps.host.hostname
      || this.props.host.hostspec !== prevProps.host.hostspec) {
      this.startContext()
    }
    if (this.props.settings.containerId !== prevProps.settings.containerId) {
      this.selectContainer()
    }
  }

  async selectContainer() {
    this.setState({ status: `Connected to ${this.props.host.hostname}/${this.props.host.hostspec} ${this.state.context} - selecting container` })
    let newContainerId = this.props.settings.containerId
    if (newContainerId === '_all') {
      newContainerId = ''
    }
    try {
      let host = `http://${this.props.host.hostname}:7402`
      await superagent
        .get(`${host}/pmapi/${this.state.context}/_store`)
        .query({ name: 'pmcd.client.container', value: newContainerId })

      this.setState({ status: `Connected to ${this.props.host.hostname}/${this.props.host.hostspec} ${this.state.context} - ${newContainerId}` })
    } catch (err) {
      this.setState({ status: `Connected to ${this.props.host.hostname}/${this.props.host.hostspec} ${this.state.context} - could not select container, ${err.message}` })
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

      this.setState({ status: 'Fetching container names' })
      res = await superagent.get(`${host}/pmapi/${context}/_fetch?names=containers.name`)
      let containerList = res.body.values[0].instances.map(i => i.value)
      this.props.onContainerListLoaded(containerList)

      // set context as last thing we do, this is the flag that we are connected
      this.setState({ context })
      this.setState({ status: `Connected to ${hostname}/${this.props.host.hostspec} ${this.state.context}` })

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
    // collect pmids to fetch
    let uniqueMetrics = this.props.chartlist
      .map((c) => c.processor.requiredMetricNames(c.config)) // extract only the metric names we need
      .reduce((xs, ys) => xs.concat(ys)) // flatten the array
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

    // go again
    setTimeout(this.pollMetrics, this.props.settings.intervalSeconds * 1000)
  }

  render () {
    return (
      <div className="main-container">
        Status: { this.state.status }<br />
        <ul>
          {
            this.props.chartlist.map((c) => (
              <li key={c.title}>Chart: {c.title}
                <Chart chartInfo={c} datasets={this.state.datasets} />
              </li>
            ))
          }
        </ul>
        Context: { this.state.context }<br />
        { DEBUG_PMIDS && <span>Available PMIDs: { JSON.stringify(this.state.pmids) }<br /></span> }
      </div>
    )
  }
}

Dashboard.propTypes = {
  host: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  chartlist: PropTypes.array.isRequired,
  onContainerListLoaded: PropTypes.func.isRequired,
}

export default Dashboard
