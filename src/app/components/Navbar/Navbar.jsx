import React from 'react'
import PropTypes from 'prop-types'

import './Navbar.css'

const Navbar = ({ embed, onClick }) => {
  if (embed) return null;

  return (
    <div className="navbar navbar-inverse navbar-fixed-top" role="navigation" onClick={onClick}>
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" href="#/">
            <img src="assets/images/vector_owl.png" alt="Vector Owl" height="20" />
          </a>
          <a className="navbar-brand" href="javascript:window.location.reload(true);history.pushState(null, '', location.href.split('?')[0]);">Vector</a>
        </div>
      </div>
    </div>
  )
}

Navbar.propTypes = {
  embed: PropTypes.bool.isRequired,
  onClick: PropTypes.func
}

export default Navbar
