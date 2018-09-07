import React from 'react'
import PropTypes from 'prop-types'

import { Button } from 'semantic-ui-react'

const DashHeaderButton = ({ icon, onClick, style }) =>
  <Button style={style} icon={icon} onClick={onClick}
    className='doNotDrag' circular={true} size='tiny' basic={true} floated='right' />

DashHeaderButton.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  style: PropTypes.object,
}

export default DashHeaderButton
