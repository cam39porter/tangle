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
        first='Cam'
        last='Porter'
        title='founder'
        description='Cam loves learning and designing systems to capture what he learns. He was a professional soccer player, engineering consultant, and ML / blockchain aficionado before founding Hex Ventures.'
        right={ false }
        twitter='cam39porter'
        linkedin='cam39porter'
        pic={ camPic }
      />
      <Profile 
        first='Myles'
        last='McGinley'
        title='founder'
        description='Myles loves helping people solve problems by starting with why. He was an investment banker, strategy consultant, and a decentralization buff before founding  Hex Ventures.'
        right={ true }
        twitter='mylesmcginley1'
        linkedin='myles-mcginley-10708954'
        pic={ mylesPic }
      />
    </div>
  </div>
)

export default TeamPage
