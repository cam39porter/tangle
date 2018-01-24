/*!
 * Home Page
 */

import React from 'react'
import Link from 'gatsby-link'

import Particles from 'react-particles-js'
import utils from '../lib/utils'

import 'tachyons'


const IndexPage = () => (
  <div className={``}>
    <Particles 
      className={`vh-90`}
      params={ utils.particlesParams }
    />
  </div>
)

export default IndexPage
