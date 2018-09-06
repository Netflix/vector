import React from 'react'
import PropTypes from 'prop-types'

class ExternalResources extends React.PureComponent {
  render () {
    const { targetUrl, text } = this.props

    return (
      <div>
        <h4>External Resources</h4>

        <ul>
          { targetUrl && text &&
            <li>The <a href="http://www.brendangregg.com/flamegraphs.html">Flame Graphs homepage</a> has a page on <a href={targetUrl}>{text}</a>.</li>
          }

          { !(targetUrl && text) &&
            <li>The <a href="http://www.brendangregg.com/flamegraphs.html">Flame Graphs homepage</a> has more information.</li>
          }

          <li>There is an ACMQ article <a href="http://queue.acm.org/detail.cfm?id=2927301">The Flame Graph</a>,
            also published in <a href="http://cacm.acm.org/magazines/2016/6/202665-the-flame-graph/abstract">CACM</a>.</li>
        </ul>
      </div>
    )
  }
}

ExternalResources.propTypes = {
  targetUrl: PropTypes.string,
  text: PropTypes.string,
}

export default ExternalResources
