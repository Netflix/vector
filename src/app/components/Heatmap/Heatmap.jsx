import React from 'react'
import PropTypes from 'prop-types'
import { ResponsiveXYFrame } from "semiotic"
import moment from 'moment'

import { uniqueFilter } from '../../processors/utils'

import { scaleThreshold } from 'd3-scale'

import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css'
import { Modal, Popup, Icon, Button, Segment } from 'semantic-ui-react'
import { SortableHandle } from 'react-sortable-hoc'

const DragHandle = SortableHandle(() => <Icon name='expand arrows alternate' />)

const tooltipContentStyle = {
  background: 'rgba(255, 255, 255, 0.85)',
  border: '1px double #ddd',
  padding: '10px 20px',
}

// collapse dataset into a single stream as this is what the xyframe heatmap view requires
function extractHeatmapValuesFromDataset(dataset, yAxisLabels) {
  const values = []
  const summary = []
  if (dataset) {
    for (let d of dataset) {
      for (let tsv of d.data) {
        if (tsv.value > 0) {
          summary.push({ ts: tsv.ts, value: d.instance, label: yAxisLabels[d.instance] || '?', weight: tsv.value })
        }
        for (let weight = 0; weight < tsv.value; weight++) {
          values.push({ ts: tsv.ts, value: d.instance, label: yAxisLabels[d.instance] || '?' })
        }
      }
    }
  }
  return values
}

function determineThresholds(chartInfo) {
  // works because input values are ranged [0,1], so we can just multiply out
  // but we need to put the first value back to ensure the 0/1 transition works
  if (chartInfo.heatmapMaxValue > 0) {
    let newThresholds = chartInfo.heatmap.thresholds.map(e => e * chartInfo.heatmapMaxValue)
    newThresholds[0] = chartInfo.heatmap.thresholds[0]

    return scaleThreshold()
      .domain(newThresholds)
      .range(chartInfo.heatmap.colors)
  }

  // default scale
  return scaleThreshold()
    .domain(chartInfo.heatmap.thresholds)
    .range(chartInfo.heatmap.colors)
}

class Heatmap extends React.Component {
  state = {
    modalOpen: false
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.datasets !== nextProps.datasets
      || this.state.modalOpen !== nextState.modalOpen)
  }

  render () {
    const { chartInfo, datasets, onCloseClicked, onNewSettings, containerList, instanceDomainMappings, containerId, pmids } = this.props

    const dataset = datasets
      ? chartInfo.processor.calculateChart(datasets, chartInfo, { instanceDomainMappings, containerList, containerId, chartInfo })
      : []
    const yAxisLookup = (dataset && dataset.map(mi => mi.yAxisLabels) || []).filter(uniqueFilter)
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

    const thresholds = determineThresholds(chartInfo)

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
            { (dataset && dataset.length > 0 && dataset.every(d => d.data.length > 0) && heatmapValues.length > 0)
              ? <ResponsiveXYFrame
                responsiveWidth={true}
                responsiveHeight={true}
                areas={[{ coordinates: heatmapValues }]}
                areaType={{ type: 'heatmap', xBins: dataset[0].data.length, yBins: yAxisLookup.length }}
                xAccessor={d => d.ts}
                yAccessor={d => d.value}
                areaStyle={d => ({
                  fill: thresholds(chartInfo.heatmapMaxValue > 0 ? d.value : d.percent),
                  stroke: 'lightgrey'
                })}
                margin={{ left: 60, bottom: 70, right: 3, top: 3 }}
                yExtent={[0, yAxisLookup.length]}
                hoverAnnotation={true}
                tooltipContent={dp => (
                  dp.binItems.length
                    ? <div style={tooltipContentStyle}>
                      <p>{dp.binItems.length && dp.binItems[0].label}: {dp.binItems.length}</p>
                    </div>
                    : null
                )}
                axes={[
                  { orient: "left",
                    tickFormat: v => yAxisLookup[v - 1] || '',
                    ticks: yAxisLookup && yAxisLookup.length,
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
