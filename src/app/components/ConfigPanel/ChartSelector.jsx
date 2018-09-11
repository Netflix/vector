import React from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'semantic-ui-react'

import CustomChartSelector from './CustomChartSelector.jsx'
import SimpleChartSelector from './SimpleChartSelector.jsx'

class ChartSelector extends React.PureComponent {
  state = {
    activeTab: 'simple',
  }

  handleTabClick = (e, { name }) => this.setState({ activeTab: name })

  render () {
    const { activeTab } = this.state
    const { charts, bundles, disabled, selectedPmids, selectedChartIds } = this.props
    const { onClearCharts, onAddChart, onRequestClose } = this.props

    return (<div>
      <Menu attached='top' tabular>
        <Menu.Item name='simple' active={activeTab === 'simple'} onClick={this.handleTabClick} />
        <Menu.Item name='custom' active={activeTab === 'custom'} onClick={this.handleTabClick} />
      </Menu>

      { activeTab === 'simple' &&
        <SimpleChartSelector
          onClearCharts={onClearCharts}
          onAddChart={onAddChart}
          onRequestClose={onRequestClose}
          disabled={disabled}
          charts={charts}
          bundles={bundles} /> }

      { activeTab === 'custom' &&
        <CustomChartSelector
          charts={charts}
          onClearCharts={onClearCharts}
          onAddChart={onAddChart}
          disabled={disabled}
          selectedPmids={selectedPmids}
          selectedChartIds={selectedChartIds} /> }

    </div>)
  }
}

ChartSelector.defaultProps = {
  disabled: false,
}

ChartSelector.propTypes = {
  charts: PropTypes.array.isRequired,
  bundles: PropTypes.array.isRequired,
  onClearCharts: PropTypes.func.isRequired,
  onAddChart: PropTypes.func.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  selectedPmids: PropTypes.object,
  selectedChartIds: PropTypes.array,
}

export default ChartSelector
