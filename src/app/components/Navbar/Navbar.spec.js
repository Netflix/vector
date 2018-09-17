/**!
 *
 *  Copyright 2018 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */

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
