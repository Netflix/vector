import React from 'react'
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme'
import { expect } from 'chai'
configure({ adapter: new Adapter() });

import ChartSelector from './ChartSelector.jsx'

describe('ChartSelector', () => {
  let component
  let props
  const create = () => {
    if (!component) {
      component = shallow(<ChartSelector {...props} />)
    }
    return component
  }

  beforeEach(() => {
    props = {
      charts: [],
      onNewChartList: () => {}
    }
    component = undefined
  })

  describe('with empty input list', () => {
    console.log(create().html())
    it('renders a Menu', () => {
      const divs = create().find('Menu')
      expect(divs.length).to.equal(1)
    })
    it('renders two menu items', () => {
      const items = create().find('Menu').find('Menu.Item')
      expect(items.length).to.equal(2)
    })
    it('renders a clear widgets item', () => {
      const text = create().find('Menu').find('Menu.Item')[0].text()
      expect(text).to.equal('Clear widgets')
    })
  })

  describe('with a single chart', () => {
    beforeEach(() => {
      props.charts.push({ title: 'cpu usage', group: 'CPU' })
    })
    it('renders three menu items', () => {
      const items = create().find('Menu').find('Menu.Item')
      expect(items.length).to.equal(3)
    })
  })

  describe('with two charts from same group', () => {
    beforeEach(() => {
      props.charts.push({ title: 'cpu usage', group: 'CPU' })
      props.charts.push({ title: 'load average', group: 'CPU' })
    })
    it('renders three menu items', () => {
      const items = create().find('Menu').find('Menu.Item')
      expect(items.length).to.equal(3)
    })
  })

  describe('with two charts from different group', () => {
    beforeEach(() => {
      props.charts.push({ title: 'cpu usage', group: 'CPU' })
      props.charts.push({ title: 'iops', group: 'DISK' })
    })
    it('renders four menu items', () => {
      const items = create().find('Menu').find('Menu.Item')
      expect(items.length).to.equal(4)
    })
  })
})
