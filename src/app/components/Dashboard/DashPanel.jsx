import React from 'react'
import PropTypes from 'prop-types'

import 'react-resizable/css/styles.css'
import { Modal, Popup, Icon, Button, Segment } from 'semantic-ui-react'
import { SortableHandle } from 'react-sortable-hoc'
import { ResizableBox } from 'react-resizable'
import 'react-resizable/css/styles.css'

const DragHandle = SortableHandle(() => <Icon name='expand arrows alternate' />)

class DashPanel extends React.Component {
  state = {
    modalOpen: false
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.datasets !== nextProps.datasets
      || this.state.modalOpen !== nextState.modalOpen)
  }

  handleSettingsIcon = () => this.setState({ modalOpen: true })
  handleCloseSettings = () => this.setState({ modalOpen: false })
  handleNewSettings = (settings) => {
    this.setState({ modalOpen: false })
    this.props.onNewSettings(settings)
  }

  chartSubtitle = (c) => c.context.target.hostname
    + (c.context.target.hostspec === 'localhost' ? '' : (' ' + c.context.target.hostspec))
    + (c.context.target.containerId === '_all' ? '' : (' ' + c.context.target.containerId))

  render () {
    const { chartInfo, datasets, onCloseClicked, containerList, instanceDomainMappings, containerId, pmids } = this.props

    const dataset = datasets
      ? chartInfo.processor.calculateChart(datasets, chartInfo, { instanceDomainMappings, containerList, containerId, chartInfo })
      : []

    const HelpComponent = chartInfo.helpComponent
    const SettingsComponent = chartInfo.settingsComponent
    const Visualisation = chartInfo.visualisation

    return (
      <Segment.Group raised>
        <Segment clearing>
          <DragHandle />
          { chartInfo.title }<br/>
          { this.chartSubtitle(chartInfo) }

          { chartInfo.settingsComponent &&
            <Modal dimmer='inverted' open={this.state.modalOpen} onClose={this.handleCloseSettings} trigger={
              <Icon  name='setting' circular fitted link onClick={this.handleSettingsIcon} /> }>
              <Modal.Content>
                <SettingsComponent {...chartInfo} pmids={pmids} onNewSettings={this.handleNewSettings} onClose={this.handleCloseSettings} />
              </Modal.Content>
            </Modal> }

          { chartInfo.helpComponent &&
            <Modal dimmer='inverted' trigger={
              <Icon name='help' circular fitted link/>}>
              <Modal.Content>
                <HelpComponent chartInfo={chartInfo} />
              </Modal.Content>
            </Modal> }

          { chartInfo.isHighOverhead &&
            <Popup content='May cost high overhead, see help' trigger={
              <Icon name='exclamation' circular fitted />} /> }

          { chartInfo.isContainerAware &&
            <Popup content='Container aware' trigger={
              <Icon name='check' circular fitted />} /> }

          <Button circular size='tiny' basic icon='close' floated='right' onClick={onCloseClicked} />
        </Segment>
        <Segment>
          <ResizableBox width={650} height={385}>
            { dataset && dataset.length > 0 &&
              <Visualisation dataset={dataset} chartInfo={chartInfo}/>
            }

            { (!dataset || dataset.length <= 0) &&
              <span>No data yet</span>
            }
          </ResizableBox>
        </Segment>
      </Segment.Group>
    )
  }
}

DashPanel.propTypes = {
  chartInfo: PropTypes.object.isRequired,
  datasets: PropTypes.array.isRequired,
  onCloseClicked: PropTypes.func.isRequired,
  onNewSettings: PropTypes.func,
  instanceDomainMappings: PropTypes.object.isRequired,
  containerList: PropTypes.array.isRequired,
  containerId: PropTypes.string.isRequired,
  pmids: PropTypes.object.isRequired,
}

export default DashPanel
