/* eslint-disable */

import React from 'react'
import { mount } from 'enzyme'
import { expect } from 'chai'
import WidgetHeader from './widget-header.jsx'

describe('WidgetHeader', () => {
  let component
  let props
  const createComponent = () => {
    if (!component) {
      component = mount(<WidgetHeader {...props} />)
    }
    return component
  }

  beforeEach(() => {
    props = {
      theWidget: {
        title: 'Spiffy widget',
        name: 'New widget thing'
      },
      onClose: () => {} // noop,
    },
    component = undefined
  })

  describe('with title and name only', () => {
    it('renders a div', () => {
      const divs = createComponent().find('div')
      expect(divs.length).to.equal(1)
    })
    it('renders a h3', () => {
      const h3s = createComponent().find('div').find('h3')
      expect(h3s.length).to.equal(1)
    })
    it('has a h3 containing a span with the correct title', () => {
      const text = createComponent().find('div').find('h3').find('span.widget-title').text()
      expect(text).to.equal('Spiffy widget')
    })
    it('has a close widget button', () => {
      const closespan = createComponent().find('div').find('h3').find('span.glyphicon-remove')
      expect(closespan.length).to.equal(1)
    })
    it('does not have a settings button', () => {
      const settings = createComponent().find('div').find('h3').find('span.glyphicon-cog')
      expect(settings.length).to.equal(0)
    })
    it('renders a name span', () => {
      const name = createComponent().find('div').find('h3').find('span.label-primary')
      expect(name.length).to.equal(1)
    })
    it('renders a name span with the correct text', () => {
      const text = createComponent().find('div').find('h3').find('span.label-primary').text()
      expect(text).to.equal('New widget thing')
    })
  })

  describe('with a hidden name', () => {
    beforeEach(() => {
      props.hideName = true
    })
    it('does not render a name span', () => {
      const name = createComponent().find('div').find('h3').find('span.label-primary')
      expect(name.length).to.equal(0)
    })
  })
})
