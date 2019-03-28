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

// TODO plenty more tests
// TODO toast messages when there are issues
// TODO enable vector to browse and collect cluster and container information from external sources
// - needs to be pluggable, eg from k8s/titus/etc

import React from 'react'
import PropTypes from 'prop-types'

/*
import process from 'process'
import { whyDidYouUpdate } from 'why-did-you-update'
if (process.env.NODE_ENV !== 'production') {
  whyDidYouUpdate(React)
}
*/

import { render } from 'react-dom'

import config from './config'

import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import ConfigPanel from './components/ConfigPanel/ConfigPanel.jsx'
import ContextPoller from './components/Pollers/ContextPoller.jsx'
import DatasetPoller from './components/Pollers/DatasetPoller.jsx'
import DashboardController from './components/ConfigPanel/DashboardController.jsx'

import { Sidebar } from 'semantic-ui-react'
import isEqual from 'lodash.isequal'
import cloneDeep from 'lodash.clonedeep'

import 'semantic-ui-css/semantic.min.css'
import { matchesTarget, getChartsFromLocation, pushQueryStringToHistory } from './utils'

import { BrowserRouter, Switch, Route } from 'react-router-dom'
import charts from './charts'
import bundles from './bundles'

const initialChartIdlist = getChartsFromLocation(location)
const initialTargets = initialChartIdlist.targets
const initialChartlist = initialChartIdlist.chartlist
  .map(c => ({
    context: { target: c.target },
    ...charts.find(ch => c.chartId === ch.chartId)
  }))

class App extends React.Component {
  state = {
    chartlist: this.props.initialChartlist,
    pollIntervalMs: 2000,
    windowIntervalMs: 120000,
    contextData: [],
    contextDatasets: [],
    targets: this.props.initialTargets,
    configVisible: this.props.initialConfigPanelOpen,
    pausedData: null,
  }

  // TODO this call block is a big ball of mud
  // can it be pushed off to somewhere else
  // or should we just switch it across to redux?

  refreshQueryString = () => {
    pushQueryStringToHistory(this.state.targets, this.state.chartlist, this.props.history)
  }

  // chart handling
  onClearChartsFromContext = (ctx) => {
    this.setState((oldState) => ({
      chartlist: oldState.chartlist.filter(chart =>
        !(matchesTarget(chart.context.target, ctx.target)))
    }), this.refreshQueryString)
  }

  onAddChartToContext = (ctx, chart) => {
    this.setState((oldState) => ({ chartlist: oldState.chartlist.concat({ ...chart, context: ctx }) }), this.refreshQueryString)
  }

  removeChartByIndex = (idx) => {
    this.setState(oldState =>
      ({ chartlist: [ ...oldState.chartlist.slice(0, idx), ...oldState.chartlist.slice(idx + 1) ] }), this.refreshQueryString)
  }
  updateChartSettings = (idx, settings) => {
    this.setState((oldState) => {
      let newChart = { ...oldState.chartlist[idx], ...settings }
      return { chartlist: [ ...oldState.chartlist.slice(0, idx), newChart, ...oldState.chartlist.slice(idx + 1) ] }
    })
  }

  // context handling
  onContextsUpdated = (contexts) => {
    this.setState(state => {
      if (isEqual(contexts, state.contextData)) return undefined

      // update any charts with the refreshed context from the chart list
      let newChartlist = this.state.chartlist.map(c => ({
        ...c,
        context: contexts.find(ctx => matchesTarget(ctx.target, c.context.target))
      }))
      return {
        chartlist: newChartlist,
        contextData: [ ...contexts ],
      }
    })
  }

  onContextDatasetsUpdated = (ctxds) => {
    this.setState({ contextDatasets: ctxds })
  }

  onNewContext = (target) => this.setState((state) => ({ targets: state.targets.concat(target) }), this.refreshQueryString)
  onRemoveContext = (context) => this.setState((state) => ({
    // remove all targets, and remove all charts
    targets: state.targets.filter(target =>
      !(matchesTarget(target, context.target))),
    chartlist: state.chartlist.filter(chart =>
      !(matchesTarget(chart.context.target, context.target))),
  }), this.refreshQueryString)

  // config panel visibility
  toggleConfigVisible = () => this.setState((state) => ({ configVisible: !state.configVisible }))
  handleRequestClose = () => this.setState({ configVisible: false })

  // app config settings
  onWindowSecondsChange = (sec) => this.setState({ windowIntervalMs: sec * 1000 })
  onPollIntervalSecondsChange = (sec) => this.setState({ pollIntervalMs: sec * 1000 })

  // to pause, we take a snapshot of the data and use this as our datasource for the dash
  // this ensures all other components, pollers etc can keep flowing through their data cleanly
  handlePlay = () => this.setState({ pausedData: null })
  handlePause = () => this.setState(state => ({ pausedData: cloneDeep(state.contextDatasets) }))

  render () {
    const isConfigPanelOpen = !this.props.embed && this.state.configVisible

    return (
      <div>
        <div className="col-md-12">
          <Navbar embed={this.props.embed} onClick={this.toggleConfigVisible} />

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

          <DashboardController
            windows={config.dataWindows}
            intervals={config.pollIntervals}
            defaultWindow={config.defaultWindowSeconds}
            defaultInterval={config.defaultIntervalSeconds}
            onPollIntervalSecondsChange={this.onPollIntervalSecondsChange}
            onWindowSecondsChange={this.onWindowSecondsChange}
            isDashboardOpen={isConfigPanelOpen}
            onDashboardToggle={this.toggleConfigVisible}
            onPlay={this.handlePlay}
            onPause={this.handlePause}
            isDashboardPlaying={!this.state.pausedData} />

          <Sidebar.Pushable style={{ minHeight: '100vh' }}>
            <Sidebar
              animation='push' // push > scale down > overlay > slide along > uncover
              direction='top'
              visible={isConfigPanelOpen} >

              <ConfigPanel
                config={config}
                charts={charts}
                bundles={bundles}
                chartlist={this.state.chartlist}
                contextData={this.state.contextData}
                onNewContext={this.onNewContext}
                onRemoveContext={this.onRemoveContext}
                onAddChartToContext={this.onAddChartToContext}
                onRequestClose={this.handleRequestClose}
                initialAddContext={this.props.initialConfigPanelOpen && this.props.initialAddContext}
                onClearChartsFromContext={this.onClearChartsFromContext} />

            </Sidebar>

            <Sidebar.Pusher>

              <Dashboard
                chartlist={this.state.chartlist}
                pausedContextDatasets={this.state.pausedData}
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
  embed: PropTypes.bool.isRequired,
  initialTargets: PropTypes.array.isRequired,
  initialChartlist: PropTypes.array.isRequired,
  initialConfigPanelOpen: PropTypes.bool.isRequired,
  initialAddContext: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
}

class PageRouter extends React.Component {
  AppEmbed = (props) =>
    <App embed={true}
      initialTargets={initialTargets}
      initialChartlist={initialChartlist}
      initialConfigPanelOpen={false}
      initialAddContext={false}
      history={props.history} />

  AppNormal = (props) =>
    <App embed={false}
      initialTargets={initialTargets}
      initialChartlist={initialChartlist}
      initialConfigPanelOpen={initialChartlist.length === 0}
      initialAddContext={initialTargets.length === 0}
      history={props.history} />

  render () {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/embed" render={this.AppEmbed}/>
          <Route path="/" render={this.AppNormal}/>
        </Switch>
      </BrowserRouter>
    )
  }
}

PageRouter.propTypes = {
}

render(<PageRouter/>, document.getElementById('app'))
