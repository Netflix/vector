import React from 'react'
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme'
configure({ adapter: new Adapter() });
import { expect } from 'chai'

import Navbar from './Navbar.jsx'

describe('Navbar', () => {
  let component
  let props
  const create = () => {
    if (!component) {
      component = mount(<Navbar {...props} />)
    }
    return component
  }

  beforeEach(() => {
    props = {
      embed: false
    },
    component = undefined
  })

  describe('in embed mode', () => {
    beforeEach(() => {
      props.embed = true
    })
    it('renders nothing', () => {
      const divs = create().find('div')
      expect(divs.length).to.equal(0)
    })
  })

  describe('in normal mode', () => {
    it('renders a div', () => {
      const divs = create().find('div')
      expect(divs.length).to.equal(3)
    })
    it('renders a div containing an img inside a link', () => {
      const img = create().find('div').find('div').find('div').find('a').find('img')
      expect(img.length).to.equal(1)
    })
  })
})
