import React from 'react'
import { render } from 'react-dom'
import 'bootstrap/dist/css/bootstrap.css'
import './_reboot.min.css'

import config from './config'
import charts from './charts'

import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import ConfigPanel from './components/ConfigPanel/ConfigPanel.jsx'
import './App.css'

// TODO pass defaults in to ConfigPanel

class App extends React.Component {
  state = {
    // provided from ConfigPanel
    host: {
      // 100.113.110.19
      // localhost
      hostname: '100.113.110.19',
      hostspec: 'localhost'
    },
    settings: {
      containerFilter: '_all',
      windowSeconds: 120,
      intervalSeconds: 2
    },
    chartlist: [
      ...charts
    ],
    // provided by dashboard, could probably refactor it
    containerList: []
  }

  onContainerListLoaded = (list) => this.setState({ containerList: list })

  render () {
    return (
      <div className="row">
        <div className="col-md-12">
          <Navbar embed={false}/>

          <ConfigPanel
            onHostDataChanged={(s) => { this.setState({ host: s }) }}
            onSettingsChanged={(s) => { this.setState({ settings: s }) }}
            containers={this.state.containerList}
            windows={config.windows}
            intervals={config.intervals}
            hostname={'100.113.110.19'}
            hostspec={'localhost'}
            windowSeconds={120}
            intervalSeconds={2}
            containerFilter={'_all'}/>

          <Dashboard
            host={this.state.host}
            settings={this.state.settings}
            chartlist={this.state.chartlist}
            onContainerListLoaded={this.onContainerListLoaded} />

          <Footer version={config.version}/>
        </div>
      </div>
    )
  }
}

App.propTypes = {
}

render(<App/>, document.getElementById('app'))
