import React from 'react'
import PropTypes from 'prop-types'

import 'tachyons'

const DefaultWrapper = ({ children }) => (
  <div>
    <header className={`f1 tc`}>Hex Ventures</header>
    <div className={`tc`}>
      { children() }
    </div>
  </div>
)

DefaultWrapper.propTypes = {
  children: PropTypes.func,
}

export default DefaultWrapper
