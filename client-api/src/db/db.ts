import { v1 as neo4j } from "neo4j-driver";
import { StatementResult } from "neo4j-driver/types/v1";
import { Logger } from "../util/logging/logger";
import { getRequestContext } from "../filters/request-context";
// import { getContext, hasAuthenticatedUser } from "../filters/request-context";
// import { UserUrn } from "../urn/user-urn";

const LOGGER = new Logger("src/db/db.ts");

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
      // if (hasAuthenticatedUser()) {
      //   verifyOwner(result, getContext().user.urn);
      // }
      return result;
    })
    .catch(error => {
      session.close();
      const context = getRequestContext();
      LOGGER.error(context, `Recieved error for query: ${cypherQuery}`);
      LOGGER.error(context, `Error response: ${error}`);
      throw error;
    });
}

// function verifyOwner(result: StatementResult, userUrn: UserUrn): void {
//   if (result.records) {
//     result.records.forEach(record => {
//       record.forEach(value => {
//         if (Array.isArray(value)) {
//           value.forEach(element => {
//             verifyNode(element, userUrn);
//           });
//         } else {
//           verifyNode(value, userUrn);
//         }
//       });
//     });
//   }
// }

// function verifyNode(element: object, userUrn: UserUrn): void {
//   if (
//     element["properties"] &&
//     element["properties"].owner &&
//     element["properties"].owner !== userUrn.toRaw()
//   ) {
//     throw new Error(
//       "Attempting to return data that is not owned by the currently authenticated user"
//     );
//   }
// }

function toObj(params: Param[]): object {
  const dict = {};
  params.forEach(param => {
    dict[param.key] = param.value;
  });
  return dict;
}

export { executeQuery };
