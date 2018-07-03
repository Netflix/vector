/* eslint-disable */

import React from 'react'
import { mount } from 'enzyme'
import { expect } from 'chai'
import DashboardFooter from './dashboard-footer.jsx'
import PropTypes from 'prop-types'

describe('DashboardFooter', () => {
  let mountedDashboardFooter
  let props
  const dashboardFooter = () => {
    if (!mountedDashboardFooter) {
      mountedDashboardFooter = mount(<DashboardFooter {...props} />)
    }
    return mountedDashboardFooter
  }

  beforeEach(() => {
    props = {
      version: undefined
    }
    mountedDashboardFooter = undefined
  })

  describe('with version 1.2.3', () => {
    beforeEach(() => {
      props.version = '1.2.3'
    })
    it('renders a div', () => {
      const divs = dashboardFooter().find('div')
      expect(divs.length).to.equal(1)
    })
    it('renders Version: 1.2.3', () => {
      const text = dashboardFooter().text()
      expect(text).to.equal('Version: 1.2.3')
    })
  })

  describe('with version 4.5.6', () => {
    beforeEach(() => {
      props.version = '4.5.6'
    })
    it('renders Version: 4.5.6', () => {
      const text = dashboardFooter().text()
      expect(text).to.equal('Version: 4.5.6')
    })
  })
})
