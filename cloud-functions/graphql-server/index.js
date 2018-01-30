/*!
 * GraphQL Express Server
 */

const { graphqlExpress } = 'apollo-server-express'

/**
 * GraphqQL Express function
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.graphql = function graphql (req, res) {
  if (req.body.message === undefined) {
    // This is an error case, as "message" is required
    res.status(400).send('No message defined!')
  } else {
    // Everything is ok
    console.log(req.body.message)
    res.status(200).end()
  }
}
// graphqlExpress({ schema: {} // TODO: create schema }) 