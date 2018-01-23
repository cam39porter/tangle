/*!
 * Home Page
 */

import React from 'react'
import Link from 'gatsby-link'

import Particles from 'react-particles-js'
import particlesUtils from '../lib/particles-utils'

import 'tachyons'


const IndexPage = () => (
  <div className={``}>
    <Particles 
      params={ particlesUtils.params }
    />
  </div>
)

export default IndexPage
