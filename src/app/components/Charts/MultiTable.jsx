import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'

import { uniqueFilter } from '../../utils'

function createTableRows(dataset) {
  if (!dataset) return []

  // an array of [ pid, comm, laddr ..]
  const headers = dataset.map(mi => mi.metric).filter(uniqueFilter)

  // create a two dimensional array of arrays
  const rows = []
  dataset.forEach(({ metric, instance, data }) => {
    rows[instance] = rows[instance] || [] // ensure a row exists for this instance
    let column = headers.indexOf(metric) // determine which column to set
    rows[instance][column] = data[0].value // set the value at the column
  })
  return { headers, tableData: rows }
}

class MultiTable extends React.PureComponent {
  render () {
    const { headers, tableData } = createTableRows(this.props.dataset)

    return (
      <Table basic='very' size='small' striped>
        <Table.Header>
          <Table.Row>
            { headers.map(hdr =>
              <Table.HeaderCell key={`hdr-${hdr}`}>{hdr}</Table.HeaderCell>
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { tableData.map((row, ridx) =>
            <Table.Row key={`row-${ridx}`}>
              { row.map((col, cidx) => <Table.Cell key={`row-${ridx}-cell-${cidx}`}>{col}</Table.Cell>) }
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    )
  }
}

MultiTable.propTypes = {
  dataset: PropTypes.array.isRequired,
}

export default MultiTable
