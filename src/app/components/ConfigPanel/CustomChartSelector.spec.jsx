import React from 'react'
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme'
import { expect } from 'chai'
configure({ adapter: new Adapter() });

import { Menu } from 'semantic-ui-react'

import CustomChartSelector from './CustomChartSelector.jsx'

describe('CustomChartSelector', () => {
  let component
  let props
  const create = () => {
    if (!component) {
      component = shallow(<CustomChartSelector {...props} />)
    }
    return component
  }

  beforeEach(() => {
    props = {
      charts: [],
      onClearCharts: () => {},
      onAddChart: () => {},
    }
    component = undefined
  })

  describe('with empty input list', () => {
    it('renders a Menu', () => {
      const menus = create().find(Menu)
      expect(menus.length).to.equal(1)
    })
    it('renders one heading and one menu items', () => {
      const items = create().find(Menu).find(Menu.Item)
      expect(items.length).to.equal(2)
    })
    it('renders a clear widgets item', () => {
      const menutext = create().find(Menu).find(Menu.Item).at(1).render().text()
      expect(menutext).to.equal('Clear charts')
    })
  })

  describe('with a single chart', () => {
    beforeEach(() => {
      props.charts.push({ title: 'cpu usage', group: 'CPU' })
    })
    it('renders four menu items', () => {
      const items = create().find(Menu).find(Menu.Item)
      expect(items.length).to.equal(4)
    })
    it('the charts header is first', () => {
      const menutext = create().find(Menu).find(Menu.Item).at(0).render().text()
      expect(menutext).to.equal('Charts')
    })
    it('the clear menu item is second', () => {
      const menutext = create().find(Menu).find(Menu.Item).at(1).render().text()
      expect(menutext).to.equal('Clear charts')
    })
    it('the cpu header is first', () => {
      const menutext = create().find(Menu).find(Menu.Item).at(2).render().text()
      expect(menutext).to.equal('CPU')
    })
    it('the cpu usage element is second', () => {
      const menutext = create().find(Menu).find(Menu.Item).at(3).render().text()
      expect(menutext).to.equal('cpu usage')
    })
  })

  describe('with two charts from same group', () => {
    beforeEach(() => {
      props.charts.push({ title: 'cpu usage', group: 'CPU' })
      props.charts.push({ title: 'load average', group: 'CPU' })
    })
    // Charts
    // - clear charts
    // CPU header
    // - cpu usage
    // - load average
    it('renders four menu items', () => {
      const items = create().find(Menu).find(Menu.Item)
      expect(items.length).to.equal(5)
    })
  })

  describe('with two charts from different group', () => {
    beforeEach(() => {
      props.charts.push({ title: 'cpu usage', group: 'CPU' })
      props.charts.push({ title: 'iops', group: 'DISK' })
      props.charts.push({ title: 'load average', group: 'CPU' })
    })
    // Charts
    // - clear charts
    // CPU
    // - cpu usage
    // - load average
    // DISK
    // - iops
    it('renders six menu items', () => {
      const items = create().find(Menu).find(Menu.Item)
      expect(items.length).to.equal(7)
    })
  })
})
