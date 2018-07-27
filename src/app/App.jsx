import React from 'react'
import { render } from 'react-dom'

import config from './config'
import charts from './charts'

import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import ConfigPanel from './components/ConfigPanel/ConfigPanel.jsx'
import './App.css'

import 'semantic-ui-css/semantic.min.css';

class App extends React.Component {
  state = {
    // provided from ConfigPanel
    host: {
      // 100.118.181.46
      // localhost
      hostname: '100.118.181.46',
      hostspec: 'localhost'
    },
    settings: {
      containerFilter: '_all',
      windowSeconds: 120,
      intervalSeconds: 2
    },
    chartlist: [ ],
    containerList: []
  }

  onContainerListLoaded = (containerList) => this.setState({ containerList })
  onClearCharts = () => this.setState({ chartlist: [] })
  onAddChart = (chart) => {
    this.setState((oldState) => ({ chartlist: [ ...oldState.chartlist, chart ] }))
  }

  removeChartByIndex = (idx) => {
    this.setState((oldState) =>
      ({ chartlist: [ ...oldState.chartlist.slice(0, idx), ...oldState.chartlist.slice(idx + 1) ] })
    )
  }

  updateChartSettings = (idx, settings) => {
    this.setState((oldState) => {
      let newChart = { ...oldState.chartlist[idx], settings: { ...settings } }
      return { chartlist: [ ...oldState.chartlist.slice(0, idx), newChart, ...oldState.chartlist.slice(idx + 1) ] }
    })
  }

  render () {
    return (
      <div>
        <div className="col-md-12">
          <Navbar embed={false} />

          <ConfigPanel
            onHostDataChanged={(h) => this.setState({ host: h })}
            onSettingsChanged={(s) => this.setState({ settings: s })}
            onClearCharts={this.onClearCharts}
            onAddChart={this.onAddChart}
            containerList={this.state.containerList}
            charts={charts}
            windows={config.windows}
            intervals={config.intervals}
            hostname={'100.118.181.46'}
            hostspec={'localhost'}
            windowSeconds={120}
            intervalSeconds={2}
            containerFilter={'_all'}/>

          <Dashboard
            host={this.state.host}
            settings={this.state.settings}
            chartlist={this.state.chartlist}
            onContainerListLoaded={this.onContainerListLoaded}
            removeChartByIndex={this.removeChartByIndex}
            updateChartSettings={this.updateChartSettings} />

          <Footer version={config.version}/>
        </div>
      </div>
    )
  }
}

App.propTypes = {
}

render(<App/>, document.getElementById('app'))
