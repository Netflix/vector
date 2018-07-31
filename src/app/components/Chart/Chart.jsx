import React from 'react'
import PropTypes from 'prop-types'
import { XYFrame } from "semiotic"
import moment from 'moment'
import ColorHash from 'color-hash'
const colorHash = new ColorHash()

import { Modal, Popup, Icon, Card } from 'semantic-ui-react'
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

function fetchSharedTooltipContent(passedData, dataset) {
  const points = fetchCoincidentPoints(passedData, dataset)

  const returnArray = [
    <div key={'header_multi'} style={tooltipStyles.header} >
      {moment(new Date(passedData.ts)).format('HH:mm:ss')}
    </div>
  ];

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
        <p key={`tooltip_p_val_${i}`} style={tooltipStyles.value}>{Number(point && point.value && point.value.value).toFixed(2)}</p>
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

  render () {
    const { chartInfo, datasets, onCloseClicked, onNewSettings, containerList, instanceDomainMappings, containerId, settings } = this.props

    if (!datasets || !datasets.length) return null

    const dataset = chartInfo.processor.calculateChart(
      datasets,
      chartInfo.config,
      { instanceDomainMappings, containerList, containerId, settings })

    const HelpComponent = chartInfo.helpComponent
    const SettingsComponent = chartInfo.settingsComponent

    const handleSettingsIcon = () => this.setState({ modalOpen: true })
    const handleNewSettings = (settings) => {
      this.setState({ modalOpen: false })
      onNewSettings(settings)
    }

    const color = (d) => colorHash.hex(d.keylabel)

    return (
      <Card style={{width: '650px' }} raised={true}>

        <Card.Content>
          <Icon className='right floated' circular fitted link name='close' onClick={onCloseClicked}/>

          { chartInfo.settingsComponent &&
            <Modal dimmer='inverted' open={this.state.modalOpen} trigger={
              <Icon className='right floated' name='setting' circular fitted link onClick={handleSettingsIcon} /> }>
              <Modal.Content>
                <SettingsComponent {...chartInfo.settings} onNewSettings={handleNewSettings} onClose={() => {}} />
              </Modal.Content>
            </Modal> }

          { chartInfo.helpComponent &&
            <Modal dimmer='inverted' trigger={
              <Icon className='right floated' name='help' circular fitted link/>}>
              <Modal.Content>
                <HelpComponent chartInfo={chartInfo} />
              </Modal.Content>
            </Modal> }

          { chartInfo.isHighOverhead &&
            <Popup content='May cost high overhead, see help' trigger={
              <Icon className='right floated' name='exclamation' circular fitted />} /> }

          { chartInfo.isContainerAware &&
            <Popup content='Container aware' trigger={
              <Icon className='right floated' name='check' circular fitted />} /> }

          <Card.Header>
            <DragHandle />
            {chartInfo.title}
          </Card.Header>
        </Card.Content>

        <Card.Content raised='true'>
          { dataset && dataset.length >= 1 &&
            <Card.Description>
              <XYFrame
                size={[600, 300]}
                lines={dataset}
                lineDataAccessor={d => d.data}
                lineStyle={d => ({ stroke: color(d), fill: color(d), fillOpacity: 0.5 })}
                areaStyle={d => ({ stroke: color(d), fill: color(d), fillOpacity: 0.5, strokeWidth: '2px' })}
                lineType={chartInfo.config.lineType || 'line'}
                defined={d => d.value !== null}
                margin={{ left: 60, bottom: 60, right: 3, top: 3 }}
                xAccessor={d => d.ts}
                yAccessor={d => d.value}
                yExtent={[0, undefined]}
                axes={[
                  { orient: "left", tickLineGenerator: horizontalTickLineGenerator },
                  { orient: "bottom",
                    tickFormat: ts => moment(ts).format('hh:mm:ss'),
                    tickLineGenerator: verticalTickLineGenerator,
                    rotate: 90,
                    ticks: Math.min(dataset[0].data.length, 12),
                    size: [100, 100] }
                ]}
                // line highlight
                hoverAnnotation={[
                  { type: 'vertical-points', threshold: 0.1, r: () => 5 },
                  { type: 'x', disable: ['connector', 'note']},
                  { type: 'frame-hover' },
                ]}
                tooltipContent={(d) => fetchSharedTooltipContent(d, dataset)}
                baseMarkProps={{ transitionDuration: 0 }} />
            </Card.Description>
          }
        </Card.Content>

      </Card>
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
  settings: PropTypes.object,
  containerId: PropTypes.string.isRequired,
}

export default Chart
