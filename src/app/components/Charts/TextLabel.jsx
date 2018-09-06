import React from 'react'
import PropTypes from 'prop-types'
import { Header } from 'semantic-ui-react'

class TextLabel extends React.PureComponent {
  render () {
    const { size, content } = this.props.chartInfo

    return (
      <Header className='doNotDrag' size={size} content={content} />
    )
  }
}

TextLabel.propTypes = {
  chartInfo: PropTypes.object.isRequired,
}

export default TextLabel
