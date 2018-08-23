import React from 'react'
import PropTypes from 'prop-types'

import { Menu, Image } from 'semantic-ui-react'

class Navbar extends React.PureComponent {
  render () {
    if (this.props.embed) return null;

    return (
      <Menu inverted={true} size={'large'} attached>
        <Menu.Item><Image centered src='assets/images/vector_owl.png' height='20'/></Menu.Item>
        <Menu.Item onClick={this.props.onClick} >VECTOR</Menu.Item>
      </Menu>
    )
  }
}

Navbar.propTypes = {
  embed: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
}

export default Navbar
