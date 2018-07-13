import React from 'react'
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme'
import { expect } from 'chai'
configure({ adapter: new Adapter() });
import Footer from './Footer.jsx'

describe('Footer', () => {
  let component
  let props
  const create = () => {
    if (!component) {
      component = shallow(<Footer {...props} />)
    }
    return component
  }

  beforeEach(() => {
    props = {
      version: undefined
    }
    component = undefined
  })

  describe('with version 1.2.3', () => {
    beforeEach(() => {
      props.version = '1.2.3'
    })
    it('renders a div', () => {
      const divs = create().find('div')
      expect(divs.length).to.equal(1)
    })
    it('renders Version: 1.2.3', () => {
      const text = create().text()
      expect(text).to.equal('Version: 1.2.3')
    })
  })

  describe('with version 4.5.6', () => {
    beforeEach(() => {
      props.version = '4.5.6'
    })
    it('renders Version: 4.5.6', () => {
      const text = create().text()
      expect(text).to.equal('Version: 4.5.6')
    })
  })
})
