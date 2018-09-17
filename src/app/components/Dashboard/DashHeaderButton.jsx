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
import PropTypes from 'prop-types'

import { Button } from 'semantic-ui-react'

const DashHeaderButton = ({ icon, onClick, style }) =>
  <Button style={style} icon={icon} onClick={onClick}
    className='doNotDrag' circular={true} size='tiny' basic={true} floated='right' />

DashHeaderButton.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  style: PropTypes.object,
}

export default DashHeaderButton
