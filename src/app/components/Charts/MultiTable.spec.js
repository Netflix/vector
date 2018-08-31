import { expect } from 'chai'
import MultiTable from './MultiTable.jsx'

describe('createTableRows', () => {
  describe('with a missing dataset', () => {
    let dataset = null
    let result = MultiTable.createTableRows(dataset)
    it('returns an empty array', () => {
      expect(Array.isArray(result)).to.equal(true)
      expect(result.length).to.equal(0)
    })
  })

  describe('with a complex dataset', () => {
    let data = [
      { "metric": "PID", "instance": 0, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": 1752 } ] },
      { "metric": "PID", "instance": 1, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": 1752 } ] },
      { "metric": "PID", "instance": 2, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": 1412 } ] },
      { "metric": "COMM", "instance": 0, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": "pmwebd" } ] },
      { "metric": "COMM", "instance": 1, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": "pmwebd" } ] },
      { "metric": "COMM", "instance": 2, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": "pmcd" } ] },
      { "metric": "LADDR", "instance": 0, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": "192.168.251.133" } ] },
      { "metric": "LADDR", "instance": 1, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": "127.0.0.1" } ] },
      { "metric": "LADDR", "instance": 2, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": "127.0.0.1" } ] },
      { "metric": "LPORT", "instance": 0, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": 44323 } ] },
      { "metric": "LPORT", "instance": 1, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": 47558 } ] },
      { "metric": "LPORT", "instance": 2, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": 44321 } ] },
      { "metric": "DADDR", "instance": 0, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": "192.168.251.1" } ] },
      { "metric": "DADDR", "instance": 1, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": "127.0.0.1" } ] },
      { "metric": "DADDR", "instance": 2, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": "127.0.0.1" } ] },
      { "metric": "DPORT", "instance": 0, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": 49644 } ] },
      { "metric": "DPORT", "instance": 1, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": 44321 } ] },
      { "metric": "DPORT", "instance": 2, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": 47558 } ] },
      { "metric": "RX_KB", "instance": 0, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": 1 } ] },
      { "metric": "RX_KB", "instance": 1, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": 0 } ] },
      { "metric": "RX_KB", "instance": 2, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": 0 } ] },
      { "metric": "TX_KB", "instance": 0, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": 1 } ] },
      { "metric": "TX_KB", "instance": 1, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": 0 } ] },
      { "metric": "TX_KB", "instance": 2, "data": [ { "ts": "2018-08-31T16:16:30.466Z", "value": 0 } ] }
    ]
    let result = MultiTable.createTableRows(data)

    it('collects the correct header instances', () => {
      expect(result.headers.length).to.equal(8)
      expect(result.headers).to.have.deep.members([
        'PID', 'COMM', 'LADDR', 'LPORT', 'DADDR', 'DPORT', 'RX_KB', 'TX_KB'
      ])
    })

    it('collects the correct data rows', () => {
      expect(result.tableData.length).to.equal(3) // there are three instances
      expect(result.tableData).to.have.deep.members([
        [ 1752, 'pmwebd', '192.168.251.133', 44323, '192.168.251.1', 49644, 1, 1 ],
        [ 1752, 'pmwebd', '127.0.0.1', 47558, '127.0.0.1', 44321, 0, 0 ],
        [ 1412, 'pmcd', '127.0.0.1', 44321, '127.0.0.1', 47558, 0, 0],
      ])
    })
  })
})
