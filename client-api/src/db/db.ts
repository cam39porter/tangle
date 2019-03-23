import { v1 as neo4j } from "neo4j-driver";
import { StatementResult } from "neo4j-driver/types/v1";
import { Logger } from "../util/logging/logger";
import { timeout, TimeoutError } from "promise-timeout";

const LOGGER = new Logger("src/db/db.ts");

const driver = neo4j.driver(
  `bolt://35.247.30.189:7687`,
  neo4j.auth.basic("neo4j", "password"),
  {
    maxTransactionRetryTime: 1
  }
);

driver.onError = error => {
  LOGGER.error("Could not connect to neo4j", error);
};
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
  const session = driver.session();
  const neoPromise = session
    .writeTransaction(tx => tx.run(cypherQuery, toObj(params)))
    .then(result => {
      session.close();
      return result;
    })
    .catch(error => {
      session.close();
      LOGGER.error(`Recieved error for query: ${cypherQuery}`);
      LOGGER.error(`Error response: ${error}`);
      throw error;
    });
  return timeout(neoPromise, 10000)
    .then(neo => {
      return neo;
    })
    .catch(err => {
      if (err instanceof TimeoutError) {
        LOGGER.error(err.message);
      }
      throw err;
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
