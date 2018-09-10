import React from 'react'
import PropTypes from 'prop-types'

import { Button, Grid } from 'semantic-ui-react'

class SimpleChartRow extends React.PureComponent {
  render () {
    const { icon, buttonLabel, disabled, onClick, description, bundle } = this.props

    return (
      <Grid.Row columns={10} verticalAlign='middle' stretched>
        <Grid.Column width={4}>
          <Button
            style={{ width: '220px', height: '120px' }}
            size='huge'
            bundle={bundle}
            icon={icon}
            content={buttonLabel}
            disabled={disabled}
            onClick={onClick} />
        </Grid.Column>
        <Grid.Column width={6} height='100%'>
          {description}
        </Grid.Column>
      </Grid.Row>
    )
  }
}

SimpleChartRow.propTypes = {
  icon: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  description: PropTypes.node.isRequired,
  bundle: PropTypes.object
}

export default SimpleChartRow
