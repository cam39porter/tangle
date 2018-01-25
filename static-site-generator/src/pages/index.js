/*!
 * Home Page
 */

import React from 'react'
import Link from 'gatsby-link'

import Particles from 'react-particles-js'
import Typist from 'react-typist'
import MathJax from 'react-mathjax'

import 'tachyons'

/*!
 * Component
 */

const IndexPage = () => (
  <div>
    {/* Title Page */}
    <div className={`vh-100`}>

      {/* Network Background */}
      <Particles 
        className={`fl vh-100 w-100`}
        params={{
          particles: {
            number: { value: 6, density: { enable: true, value_area: 200 } },
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
              bounce: true,
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

      {/* Headline */}
      <div className={`dt absolute bottom-2 vh-75 w-100 center`}>
        <div className={`dtc`}>

          {/* Left Phrase */}
          <h1 className={`dib absolute top-2 left-0 w-50 bg-navy white pa5-ns pa4 f2-ns f4 tr-ns tl v-mid`}>
            <span>Next level </span><span className={`underline`}>knowledge<br/>management</span>
          </h1>

          {/* Right Phrase */}
          <h1 className={`dib absolute top-2 right-0 w-50 navy pa5-ns pa4 f2-ns f4 tl v-mid`}>
            <Typist
              cursor={{
                show: true,
                blink: true,
                element: '|',
                hideWhenDone: true,
                hideWhenDoneDelay: 0,
              }}
            >
              <span className={`f2-ns f4`}>for the teams of the future</span>
              <Typist.Backspace count={19} delay={1000} />
              <span className={`f2-ns f4`}>executive with vision</span>
              <Typist.Backspace count={25} delay={1000} />
              <span className={`f-headline-ns f1 light-blue tracked-mega`}>YOU</span>
            </Typist>
          </h1>
        </div>
      </div>
      
      {/* Message Button */}
      <div className={`dtc mb5 absolute bottom-2 tc w-100`}>
        <MathJax.Context>
            <div className={`mw-1 pa4 tracked navy ttu`}>
              <p className={`f6-ns f7`}>Ask us about our formula ;)</p>
              <div className={`f3`}>
                <MathJax.Node>
                  {`U(f) \\propto K ( v |K|^{\\beta} - c)`}
                </MathJax.Node>
              </div>
            </div>
        </MathJax.Context>
        <Link to='/' className={`mw-1 dim bg-navy pa3 shadow-5 f6-ns f7 tracked white no-underline ttu`}>message</Link>
      </div>
    </div>
  </div>
)

export default IndexPage
