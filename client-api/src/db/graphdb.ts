const neo4j = require("neo4j-driver").v1;

const driver = neo4j.driver(
  "bolt+routing://35.197.47.235:7687",
  neo4j.auth.basic("neo4j", "Z868sybiq7cGzFeA")
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
