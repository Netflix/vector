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
import { Table } from 'semantic-ui-react'

class SimpleTable extends React.PureComponent {
  render () {
    const dataset = this.props.dataset

    return (
      <Table basic='very' size='small' striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Value</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { dataset.map(({ title, data }, ridx) =>
            <Table.Row key={`mi-${ridx}`}>
              <Table.Cell>{title}</Table.Cell>
              <Table.Cell>{data[0].value}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    )
  }
}

SimpleTable.propTypes = {
  dataset: PropTypes.array.isRequired,
}

export default SimpleTable
