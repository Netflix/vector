import React from 'react'
import PropTypes from 'prop-types'

import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css'
import { Modal, Popup, Icon, Button, Segment, Table as SemanticTable } from 'semantic-ui-react'
import { SortableHandle } from 'react-sortable-hoc'

const DragHandle = SortableHandle(() => <Icon name='expand arrows alternate' />)

class Table extends React.Component {
  state = {
    modalOpen: false
  }

  render () {
    const { chartInfo, datasets, onCloseClicked, onNewSettings, containerList, instanceDomainMappings, containerId, pmids } = this.props

    const dataset = datasets
      ? chartInfo.processor.calculateChart(datasets, chartInfo, { instanceDomainMappings, containerList, containerId, chartInfo })
      : []

    const HelpComponent = chartInfo.helpComponent
    const SettingsComponent = chartInfo.settingsComponent

    const handleSettingsIcon = () => this.setState({ modalOpen: true })
    const handleNewSettings = (settings) => {
      this.setState({ modalOpen: false })
      onNewSettings(settings)
    }
    const handleCloseSettings = () => {
      this.setState({ modalOpen: false })
    }

    const chartSubtitle = (c) => c.context.target.hostname
      + (c.context.target.hostspec === 'localhost' ? '' : (' ' + c.context.target.hostspec))
      + (c.context.target.containerId === '_all' ? '' : (' ' + c.context.target.containerId))

    const headerRow = ['Instance', 'Values']

    const renderBodyRow = ({ title, data }, idx) => ({
      key: idx,
      cells: [ title, data.length > 0 ? data[data.length - 1].value : '' ]
    })

    return (
      <Segment.Group raised>
        <Segment clearing>
          <DragHandle />
          { chartInfo.title }<br/>
          { chartSubtitle(chartInfo) }

          { chartInfo.settingsComponent &&
            <Modal dimmer='inverted' open={this.state.modalOpen} onClose={handleCloseSettings} trigger={
              <Icon  name='setting' circular fitted link onClick={handleSettingsIcon} /> }>
              <Modal.Content>
                <SettingsComponent {...chartInfo} pmids={pmids} onNewSettings={handleNewSettings} onClose={handleCloseSettings} />
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
              <SemanticTable basic='very' headerRow={headerRow} tableData={dataset} renderBodyRow={renderBodyRow} />
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

Table.propTypes = {
  chartInfo: PropTypes.object.isRequired,
  datasets: PropTypes.array.isRequired,
  onCloseClicked: PropTypes.func.isRequired,
  onNewSettings: PropTypes.func,
  instanceDomainMappings: PropTypes.object.isRequired,
  containerList: PropTypes.array.isRequired,
  containerId: PropTypes.string.isRequired,
  pmids: PropTypes.object.isRequired,
}

export default Table
