/*!
 * GraphQL Express Server
 */
const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools')

const schema = require('./schema.js');
const mocks = require('./test/mocks');
const resolvers = require('./resolvers');

/*!
 * Make the schema executable
 */

const executableSchema = makeExecutableSchema({ 
  typeDefs: schema,
  resolvers: resolvers
 })

 const PORT = 3000;
 const app = express();

 // bodyParser is needed just for POST.
 app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: executableSchema }));
 app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); // if you want GraphiQL enabled
 
 app.listen(PORT);
