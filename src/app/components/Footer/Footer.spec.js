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
