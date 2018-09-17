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

import * as formats from './formats'
import { expect } from 'chai'

describe('percentage', () => {
  describe('with integer', () => {
    let data = 3
    it('returns correct percentage', () => {
      let result = formats.percentage(data)
      expect(result).to.equal('300%')
    })
  })

  describe('with real number', () => {
    let data = 3.12345
    it('returns two decimal place number', () => {
      let result = formats.percentage(data)
      expect(result).to.equal('312%')
    })
  })

  describe('with real number (0 first place)', () => {
    let data = 0.12345
    it('returns two decimal place number', () => {
      let result = formats.percentage(data)
      expect(result).to.equal('12%')
    })
  })
})

describe('number', () => {
  describe('with integer', () => {
    let data = 3
    it('returns two decimal place number', () => {
      let result = formats.number(data)
      expect(result).to.equal('3.00')
    })
  })

  describe('with real number', () => {
    let data = 3.12345
    it('returns two decimal place number', () => {
      let result = formats.number(data)
      expect(result).to.equal('3.12')
    })
  })
})

describe('integer', () => {
  describe('with integer', () => {
    let data = 3
    it('returns integer', () => {
      let result = formats.integer(data)
      expect(result).to.equal('3')
    })
  })

  describe('with real number', () => {
    let data = 3.12345
    it('returns integer', () => {
      let result = formats.integer(data)
      expect(result).to.equal('3')
    })
  })
})
