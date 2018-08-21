import React from 'react'
import PropTypes from 'prop-types'
import { ResponsiveXYFrame } from "semiotic"
import moment from 'moment'

import { scaleThreshold } from 'd3-scale'

import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css'
import { Modal, Popup, Icon, Button, Segment } from 'semantic-ui-react'
import { SortableHandle } from 'react-sortable-hoc'

const DragHandle = SortableHandle(() => <Icon name='expand arrows alternate' />)

// collapse dataset into a single stream as this is what the xyframe heatmap view requires
function extractHeatmapValuesFromDataset(dataset, yAxisLabels) {
  const values = []
  if (dataset) {
    for (let d of dataset) {
      for (let tsv of d.data) {
        for (let weight = 0; weight < tsv.value; weight++) {
          values.push({ ts: tsv.ts, value: d.instance + 1, label: yAxisLabels[d.instance] || '?' })
        }
      }
    }
  }
  return values
}

class Heatmap extends React.Component {
  state = {
    modalOpen: false
  }

  shouldComponentUpdate(nextProps /*, nextState */) {
    // avoid a render call if the dataset has not changed, this avoids unnecessary polls when
    // the context data changes but the dataset itself has not changed, to do this we store a copy
    // in state
    return (this.props.datasets !== nextProps.datasets)
  }

  render () {
    const { chartInfo, datasets, onCloseClicked, onNewSettings, containerList, instanceDomainMappings, containerId, pmids } = this.props

    const dataset = datasets
      ? chartInfo.processor.calculateChart(datasets, chartInfo, { instanceDomainMappings, containerList, containerId, chartInfo })
      : []
    const yAxisLookup = (dataset && dataset.map(mi => mi.yAxisLabels)) || []
    const heatmapValues = extractHeatmapValuesFromDataset(dataset, yAxisLookup)

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

    const thresholds = scaleThreshold()
      .domain(chartInfo.heatmap.thresholds)
      .range(chartInfo.heatmap.colors)

    const chartSubtitle = (c) => c.context.target.hostname
      + (c.context.target.hostspec === 'localhost' ? '' : (' ' + c.context.target.hostspec))
      + (c.context.target.containerId === '_all' ? '' : (' ' + c.context.target.containerId))

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
            { (dataset && dataset.length > 0 && dataset.every(d => d.data.length > 0))
              ? <ResponsiveXYFrame
                responsiveWidth={true}
                responsiveHeight={true}
                points={[{ coordinates: heatmapValues }]}
                areas={[{ coordinates: heatmapValues }]}
                areaType={{ type: 'heatmap', xBins: dataset[0].data.length, yBins: dataset.length }}
                xAccessor={d => d.ts}
                yAccessor={d => d.value}
                areaStyle={d => ({ fill: thresholds(d.percent), stroke: 'darkgrey' })}
                margin={{ left: 60, bottom: 70, right: 3, top: 3 }}
                yExtent={[0, dataset.length]}
                hoverAnnotation={true}
                tooltipContent={dp => { return (<p>{dp.binItems.length && dp.binItems[0].label}: {dp.binItems.length}</p>) }}
                axes={[
                  { orient: "left",
                    tickFormat: v => yAxisLookup[v - 1] || '',
                    footer: true },
                  { orient: "bottom",
                    tickFormat: ts => {
                      return (<text transform='rotate(90)'>{moment(ts).format('hh:mm:ss')}</text>)
                    },
                    footer: true }
                ]}
                baseMarkProps={{ forceUpdate: true }} />
              : <span>No data yet</span>
            }
          </ResizableBox>
        </Segment>
      </Segment.Group>
    )
  }
}

Heatmap.propTypes = {
  chartInfo: PropTypes.object.isRequired,
  datasets: PropTypes.array.isRequired,
  onCloseClicked: PropTypes.func.isRequired,
  onNewSettings: PropTypes.func,
  instanceDomainMappings: PropTypes.object.isRequired,
  containerList: PropTypes.array.isRequired,
  containerId: PropTypes.string.isRequired,
  pmids: PropTypes.object.isRequired,
}

export default Heatmap
