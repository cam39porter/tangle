/*!
 * Graph API
 */

import server from './src/server'

/*!
 * Host and Port
 */

const PORT = 8080
const HOST = '0.0.0.0'

/*!
 * Start listening
 */

server.listen(PORT, () => console.log('App listening on port 8080'))