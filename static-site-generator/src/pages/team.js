/*!
 * Team Page
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
 * Pictures
 */

import camPic from '../assets/team-pics/cam.jpg'
import mylesPic from '../assets/team-pics/myles.jpg'

/*!
 * Component
 */

const TeamPage = () => (
  <div className={``}>

    {/* Header Particles */}
    <Particles 
      className={`vh-25 w-100`}
      params={particlesConfig}
    />

    {/* Team Members */}
    <div className={`flex-wrap`}>
      <Profile 
        first='Cameron'
        last='Porter'
        title='founder'
        description='Cam played soccer for a while and now does this.'
        right={ false }
        twitter='cam39porter'
        pic={ camPic }
      />
      <Profile 
        first='Myles'
        last='McGinley'
        title='founder'
        description='Myles consulted for a while and now does this.'
        right={ true }
        twitter='mylesmcginley1'
        pic={ mylesPic }
      />
    </div>
  </div>
)

export default TeamPage
