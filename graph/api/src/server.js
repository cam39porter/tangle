/*!
 * Server routing and handler
 */

import express from 'express'
import bodyParser from 'body-parser'

const app = express()

/*!
 * Setup body parsing
 */

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())

/*!
 * Setup router
 */

var router = express.Router()

router.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/', router)

/*!
 * Exports
 */

export default app

