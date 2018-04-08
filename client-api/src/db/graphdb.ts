const neo4j = require("neo4j-driver").v1;

const driver = neo4j.driver(
  "bolt://35.197.47.242:7687",
  neo4j.auth.basic("neo4j", "x3neTnBJLFkH8R3x")
);
const session = driver.session();

function execute(cypherQuery) {
  return session
    .run(cypherQuery)
    .then(result => {
      session.close();
      return result;
    })
    .catch(error => {
      session.close();
      console.log(error);
    });
}

export { execute };
