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
