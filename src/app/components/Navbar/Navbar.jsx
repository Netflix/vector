import React from 'react'
import PropTypes from 'prop-types'

import { Menu, Image } from 'semantic-ui-react'

import './Navbar.css'

const Navbar = ({ embed }) => {
  if (embed) return null;

  return (
    <Menu inverted={true} size={'large'} attached>
      <Menu.Item><Image centered src='assets/images/vector_owl.png' height='20'/></Menu.Item>
      <Menu.Item size='big' href="javascript:window.location.reload(true);history.pushState(null, '', location.href.split('?')[0]);">VECTOR</Menu.Item>
    </Menu>
  )
}

Navbar.propTypes = {
  embed: PropTypes.bool.isRequired,
}

export default Navbar
