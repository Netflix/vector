import React from 'react'
import { render } from 'react-dom'

import config from './config'

import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import ConfigPanel from './components/ConfigPanel/ConfigPanel.jsx'
import ContextPoller from './components/ContextPoller.jsx'
import DatasetPoller from './components/DatasetPoller.jsx'

import { Sidebar } from 'semantic-ui-react'

import { arrayMove } from 'react-sortable-hoc'
import 'semantic-ui-css/semantic.min.css'

class App extends React.Component {
  state = {
    chartlist: [],
    pollIntervalMs: 2000,
    windowIntervalMs: 120000,
    contextData: [],
    contextDatasets: [],
    targets: [],
    configVisible: false,
  }

  onClearChartsFromContext = (ctx) => {
    console.log('onClearChartsFromContext', ctx, this.state.chartlist)
    this.setState((oldState) => ({
      chartlist: oldState.chartlist.filter(chart =>
        !(chart.context.target.hostname === ctx.target.hostname
        && chart.context.target.hostspec === ctx.target.hostspec
        && chart.context.target.containerId === ctx.target.containerId))
    }))
  }

  onAddChartToContext = (ctx, chart) => {
    this.setState((oldState) => ({ chartlist: oldState.chartlist.concat({ ...chart, context: ctx }) }))
  }

  removeChartByIndex = (idx) => {
    this.setState((oldState) =>
      ({ chartlist: [ ...oldState.chartlist.slice(0, idx), ...oldState.chartlist.slice(idx + 1) ] })
    )
  }

  updateChartSettings = (idx, settings) => {
    this.setState((oldState) => {
      let newChart = { ...oldState.chartlist[idx], ...settings }
      return { chartlist: [ ...oldState.chartlist.slice(0, idx), newChart, ...oldState.chartlist.slice(idx + 1) ] }
    })
  }

  onMoveChart = (oldIndex, newIndex) => {
    this.setState((oldState) => ({
      chartlist: arrayMove(oldState.chartlist, oldIndex, newIndex)
    }))
  }

  onContextsUpdated = (contexts) => this.setState({ contextData: [ ...contexts ] })
  onContextDatasetsUpdated = (ctxds) => this.setState({ contextDatasets: ctxds })
  onNewContext = (target) => this.setState((state) => ({ targets: state.targets.concat(target) }))
  toggleConfigVisible = () => this.setState((state) => ({ configVisible: !state.configVisible }))
  handleSidebarHide = () => this.setState({ configVisible: false })
  onWindowSecondsChange = (sec) => this.setState({ windowIntervalMs: sec * 1000 })
  onPollIntervalSecondsChange = (sec) => this.setState({ pollIntervalMs: sec * 1000 })

  render () {
    return (
      <div>
        <div className="col-md-12">
          <Navbar embed={false} onClick={this.toggleConfigVisible} />

          <ContextPoller
            pollIntervalMs={5000}
            targets={this.state.targets}
            onContextsUpdated={this.onContextsUpdated} />

          <DatasetPoller
            pollIntervalMs={this.state.pollIntervalMs}
            charts={this.state.chartlist}
            windowIntervalMs={this.state.windowIntervalMs}
            contextData={this.state.contextData}
            onContextDatasetsUpdated={this.onContextDatasetsUpdated} />

          <Sidebar.Pushable style={{ minHeight: '100vh' }}>
            <Sidebar
              animation='overlay'
              direction='top'
              visible={this.state.chartlist.length === 0 || this.state.configVisible ? true : undefined}
              onHide={this.handleSidebarHide} >
              <ConfigPanel
                contextData={this.state.contextData}
                onNewContext={this.onNewContext}
                onAddChartToContext={this.onAddChartToContext}
                onClearChartsFromContext={this.onClearChartsFromContext}
                onWindowSecondsChange={this.onWindowSecondsChange}
                onPollIntervalSecondsChange={this.onPollIntervalSecondsChange} />
            </Sidebar>

            <Sidebar.Pusher>
              <Dashboard
                chartlist={this.state.chartlist}
                contextDatasets={this.state.contextDatasets}
                removeChartByIndex={this.removeChartByIndex}
                updateChartSettings={this.updateChartSettings}
                onMoveChart={this.onMoveChart} />
              <Footer version={config.version}/>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </div>
      </div>
    )
  }
}

App.propTypes = {
}

render(<App/>, document.getElementById('app'))
