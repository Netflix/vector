import React from 'react'
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme'
configure({ adapter: new Adapter() });
import { expect } from 'chai'

import { Menu } from 'semantic-ui-react'

import Navbar from './Navbar.jsx'

describe('Navbar', () => {
  let component
  let props
  const create = () => {
    if (!component) {
      component = shallow(<Navbar {...props} />)
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
    it('renders no Menu', () => {
      expect(create().find(Menu).exists()).to.be.false
    })
  })

  describe('in normal mode', () => {
    it('renders a Menu', () => {
      expect(create().find(Menu).exists()).to.be.true
    })
    it('renders a two Menu.Items', () => {
      expect(create().find(Menu).find(Menu.Item).length).to.equal(2)
    })
  })
})
