import { v1 as neo4j } from "neo4j-driver";
import { StatementResult } from "neo4j-driver/types/v1";

const driver = neo4j.driver(
  process.env.NEO4J_ENDPOINT,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const session = driver.session();

export class Param {
  public key: string;
  public value: string | number | string[];
  constructor(key: string, value: string | number | string[]) {
    this.key = key;
    this.value = value;
  }
}

function executeQuery(
  cypherQuery: string,
  params: Param[]
): Promise<StatementResult> {
  return session
    .run(cypherQuery, toObj(params))
    .then(result => {
      session.close();
      return result;
    })
    .catch(error => {
      session.close();
      console.log(cypherQuery);
      console.error(error);
      throw error;
    });
}
function toObj(params: Param[]): object {
  const dict = {};
  params.forEach(param => {
    dict[param.key] = param.value;
  });
  return dict;
}

export { executeQuery };
