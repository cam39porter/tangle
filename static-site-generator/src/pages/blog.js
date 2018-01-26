/*!
 * Blog Posts Page
 */

import React from 'react'
import Link from 'gatsby-link'

import Profile from '../components/profile'

import Particles from 'react-particles-js'
import particlesConfig from '../../config/particles'

import Hexagon from 'react-hexagon'

import colors from '../../config/colors'

import Typist from 'react-typist'

import 'tachyons'

/*!
 * Component
 */

const BlogPage = () => (
  <div className={``}>

    {/* Header Particles */}
    <Particles 
      className={`vh-25 w-100`}
      params={particlesConfig}
    />
    
  </div>
)

export default BlogPage
