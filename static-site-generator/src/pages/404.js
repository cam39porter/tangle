/*!
 * 404 Page
 */

import React from 'react'
import Link from 'gatsby-link'

import Particles from 'react-particles-js'
import particlesConfig from '../../config/particles'

import 'tachyons'

/*!
 * Component
 */

const NotFoundPage = () => (
  <div className={`vh-100`}>

    {/* Header */}
    <Particles 
      className={`fl vh-25 w-100`}
      params={particlesConfig}
    />

    {/* 404 */}
    <div className={`dt w-100`}>
      <h1 className={`dtc w-50 vh-25 bg-navy white pa4 v-mid tr dim no-underline`}>
        <h1 className={`f2-ns f3`}>
          Oh No
        </h1>
      </h1>

      {/*  */}
      <h1 className={`dtc w-50 vh-25 pa3 bg-white navy f4-ns f5 lh-copy tl v-mid`}>
        We don't have knowledge of this page ;)
      </h1>
    </div>

    {/* Footer */}
    <Particles 
      className={`fl vh-25 w-100`}
      params={particlesConfig}
    />
  </div>
)

export default NotFoundPage
