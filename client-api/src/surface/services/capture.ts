import * as moment from "moment";
import { executeQuery } from "../../db/db";
import { getAuthenticatedUser } from "../../filters/request-context";
import { getUrnType } from "../../helpers/urn-helpers";
import { Graph } from "../../surface/models/graph";
import { PageInfo } from "../../surface/models/page-info";
import { SearchResults } from "../../surface/models/search-results";
import { buildGraph } from "../formatters/graph";
import { expandCaptures } from "../services/expand";

export function getNode(urn: string): Promise<Graph> {
  if (getUrnType(urn) === "capture") {
    return getCapture(urn);
  } else {
    return getOthers(urn);
  }
}

export function getAllByUseCase(
  useCase: string,
  timezoneOffset: number
): Promise<SearchResults> {
  if (useCase === "CAPTURED_TODAY") {
    return getAllCapturedToday(timezoneOffset);
  } else if (useCase === "ALL") {
    return getAll();
  } else {
    return getAll();
  }
}

function getAll() {
  const userId = getAuthenticatedUser().id;
  return executeQuery(`MATCH (roots:Capture)<-[created:CREATED]-(user:User {id:"${userId}"})
  WITH roots
  ORDER BY roots.created DESC
  LIMIT 50
  ${expandCaptures(userId)}
  RETURN roots, nodes, relationships
  `).then(res => {
    return new SearchResults(
      buildGraph(
        res.records[0].get("nodes"),
        res.records[0].get("relationships"),
        null,
        res.records[0].get("roots")
      ),
      new PageInfo(
        0,
        res.records[0].get("nodes").length,
        res.records[0].get("nodes").length
      )
    );
  });
}

function getAllCapturedToday(timezoneOffset: number): Promise<SearchResults> {
  const userId = getAuthenticatedUser().id;
  const since = getCreatedSince(timezoneOffset).unix() * 1000;

  return executeQuery(
    `MATCH (roots:Capture)<-[created:CREATED]-(user:User {id:"${userId}"})
    WHERE roots.created > ${since} AND NOT EXISTS (roots.archived)
    WITH roots
    ORDER BY roots.created DESC
    LIMIT 50
    ${expandCaptures(userId)}
    RETURN roots, nodes, relationships
    `
  ).then(res => {
    return new SearchResults(
      buildGraph(
        res.records[0].get("nodes"),
        res.records[0].get("relationships"),
        null,
        res.records[0].get("roots")
      ),
      new PageInfo(
        0,
        res.records[0].get("nodes").length,
        res.records[0].get("nodes").length
      )
    );
  });
}

function getCreatedSince(timezoneOffset: number) {
  return moment
    .utc()
    .add(timezoneOffset ? moment.duration(timezoneOffset, "hours") : 0)
    .startOf("day")
    .subtract(timezoneOffset ? moment.duration(timezoneOffset, "hours") : 0);
}

function getOthers(urn: string) {
  const userUrn = getAuthenticatedUser().id;
  return executeQuery(`MATCH (other {id:"${urn}"})-[r]-(roots:Capture)<-[:CREATED]-(u:User {id:"${userUrn}"})
  WHERE NOT EXISTS(roots.archived) OR roots.archived = false
  ${expandCaptures(userUrn)}
  RETURN roots, nodes, relationships
  `).then(res => {
    return buildGraph(
      res.records[0].get("nodes"),
      res.records[0].get("relationships"),
      urn,
      res.records[0].get("roots")
    );
  });
}

function getCapture(urn: string) {
  const userUrn = getAuthenticatedUser().id;
  return executeQuery(`MATCH (roots:Capture {id:"${urn}"})
  ${expandCaptures(userUrn)}
  RETURN roots, nodes, relationships
  `).then(res => {
    return buildGraph(
      res.records[0].get("nodes"),
      res.records[0].get("relationships"),
      urn,
      res.records[0].get("roots")
    );
  });
}
