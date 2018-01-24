/*!
 * Home Page
 */

import React from 'react'
import Link from 'gatsby-link'

import Particles from 'react-particles-js'

import 'tachyons'

/*!
 * Component
 */

const IndexPage = ({ data }) => (
  <div className={``}>
    <Particles 
      className={`vh-100`}
      params={{
        particles: {
          number: { value: 6, density: { enable: true, value_area: 100 } },
          color: { value: '#001b44' },
          shape: {
            type: "polygon",
            stroke: { width: 0, color: '#001b44' },
            polygon: { nb_sides: 6 },
          },
          opacity: {
            value: 0.05,
            random: true,
            anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
          },
          size: {
            value: 8,
            random: false,
            anim: { enable: true, speed: 10, size_min: 40, sync: false }
          },
          line_linked: {
            enable: true,
            distance: 250,
            color: '#001b44',
            opacity: 0.1,
            width: 1
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 1200 }
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: false, mode: "repulse" },
            resize: true
            },
            modes: {
              grab: { distance: 400, line_linked: { opacity: 1 } },
              bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
              repulse: { distance: 200, duration: 0.4 },
              push: { particles_nb: 4 },
              remove: { particles_nb: 2 }
            }
          },
          retina_detect: true
        }
      }
    />
  </div>
)

export default IndexPage
