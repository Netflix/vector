import React from 'react'
import PropTypes from 'prop-types'
import { ResponsiveXYFrame } from "semiotic"
import moment from 'moment'
import ColorHash from 'color-hash'
const colorHash = new ColorHash()

import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css'
import { Modal, Popup, Icon, Button, Segment } from 'semantic-ui-react'
import { SortableHandle } from 'react-sortable-hoc'

const tooltipStyles = {
  header: {fontWeight: 'bold', borderBottom: 'thin solid black', marginBottom: '10px', textAlign: 'center'},
  lineItem: {position: 'relative', display: 'block', textAlign: 'left'},
  title: {display: 'inline-block', margin: '0 5px 0 15px'},
  value: {display: 'inline-block', fontWeight: 'bold', margin: '0'},
  wrapper: {background:"rgba(255,255,255,0.8)", minWidth: "max-content", whiteSpace: "nowrap"}
}

const DragHandle = SortableHandle(() => <Icon name='expand arrows alternate' />)

// Search the lines for a similar x value for vertical shared tooltip
function fetchCoincidentPoints(passedData, dataset) {
  return dataset
    .map((point) => ({
      keylabel: point.keylabel,
      color: colorHash.hex(point.keylabel),
      value: point.data.find((i) => {
        return i.ts.getTime() === passedData.ts.getTime();
      })}))
    .filter((point) => !!point.value)
    .sort((a, b) => {
      return b.value.value - a.value.value;
    })
}

const verticalTickLineGenerator = (axisData) => {
  const { xy } = axisData
  const style = `M${xy.x1},${xy.y1}L${xy.x1},${xy.y2}Z`
  // cheat the key value by using the style text since it should be unique
  return <path key={style} style={{ stroke: "lightgrey" }} d={style} />
}

const horizontalTickLineGenerator = (axisData) => {
  const { xy } = axisData
  const style = `M${xy.x1},${xy.y1}L${xy.x2},${xy.y1}Z`
  // cheat the key value by using the style text since it should be unique
  return <path key={style} style={{ stroke: "lightgrey" }} d={style} />
}

function fetchSharedTooltipContent(passedData, dataset, formatter) {
  const points = fetchCoincidentPoints(passedData, dataset)

  const returnArray = [
    <div key={'header_multi'} style={tooltipStyles.header} >
      {moment(new Date(passedData.ts)).format('HH:mm:ss')}
    </div>
  ];

  // provide a default formatter if none was input
  const format = formatter || ((val) => val)

  points.forEach((point, i) => {
    returnArray.push([
      <div key={`tooltip_line_${i}`} style={tooltipStyles.lineItem} >
        <p key={`tooltip_color_${i}`}
          style={{
            width: '10px', height: '10px',
            backgroundColor: point.color,
            display: 'inline-block', position: 'absolute',
            top: '8px',
            left: '0',
            margin: '0'
          }} />
        <p key={`tooltip_p_${i}`} style={tooltipStyles.title}>{point.keylabel}</p>
        <p key={`tooltip_p_val_${i}`} style={tooltipStyles.value}>{format(point.value && point.value.value)}</p>
      </div>
    ]);
  });

  return (
    <div style={tooltipStyles.wrapper} >
      {returnArray}
    </div>
  );
}

class Chart extends React.Component {
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

    const color = (d) => colorHash.hex(d.keylabel)

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
            { dataset && dataset.length > 0 &&
              <ResponsiveXYFrame
                responsiveWidth={true}
                responsiveHeight={true}
                lines={dataset}
                lineDataAccessor={d => d.data}
                lineStyle={d => ({ stroke: color(d), fill: color(d), fillOpacity: 0.5 })}
                areaStyle={d => ({ stroke: color(d), fill: color(d), fillOpacity: 0.5, strokeWidth: '2px' })}
                lineType={chartInfo.lineType || 'line'}
                defined={d => d.value !== null}
                margin={{ left: 60, bottom: 70, right: 3, top: 3 }}
                xAccessor={d => d.ts}
                yAccessor={d => d.value}
                yExtent={[0, undefined]}
                axes={[
                  { orient: "left",
                    tickFormat: chartInfo.yTickFormat,
                    tickLineGenerator: horizontalTickLineGenerator },
                  { orient: "bottom",
                    tickFormat: ts => moment(ts).format('hh:mm:ss'),
                    tickLineGenerator: verticalTickLineGenerator,
                    rotate: 90,
                    ticks: Math.min(dataset[0].data.length, 12),
                    size: [100, 100] }
                ]}
                // line highlight
                hoverAnnotation={[
                  { type: 'frame-hover' }, // shows the tooltip frame
                ]}
                tooltipContent={(d) => fetchSharedTooltipContent(d, dataset, chartInfo.yTickFormat)}
                baseMarkProps={{ forceUpdate: true }} />
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

Chart.propTypes = {
  chartInfo: PropTypes.object.isRequired,
  datasets: PropTypes.array.isRequired,
  onCloseClicked: PropTypes.func.isRequired,
  onNewSettings: PropTypes.func,
  instanceDomainMappings: PropTypes.object.isRequired,
  containerList: PropTypes.array.isRequired,
  containerId: PropTypes.string.isRequired,
  pmids: PropTypes.object.isRequired,
}

export default Chart
