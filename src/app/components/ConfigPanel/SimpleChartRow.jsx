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

import { Button, Grid } from 'semantic-ui-react'

class SimpleChartRow extends React.PureComponent {
  render () {
    const { icon, buttonLabel, disabled, onClick, description, bundle } = this.props

    return (
      <Grid.Row columns={10} verticalAlign='middle' stretched>
        <Grid.Column width={4}>
          <Button
            style={{ width: '220px', height: '120px' }}
            size='huge'
            bundle={bundle}
            icon={icon}
            content={buttonLabel}
            disabled={disabled}
            onClick={onClick} />
        </Grid.Column>
        <Grid.Column width={6} height='100%'>
          {description}
        </Grid.Column>
      </Grid.Row>
    )
  }
}

SimpleChartRow.propTypes = {
  icon: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  description: PropTypes.node.isRequired,
  bundle: PropTypes.object
}

export default SimpleChartRow
