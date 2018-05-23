import { QueryProps } from "react-apollo";
import qs from "query-string";
import { Location } from "../types";

// GraphQL
const getIsLoadingOrError = (query: QueryProps): boolean => {
  return query.loading || query.error ? true : false;
};

// URLs
const getQuery = (queryString: string): string => {
  return (
    qs.parse(queryString, {
      ignoreQueryPrefix: true
    }).query || ""
  );
};

const getId = (queryString: string): string => {
  return (
    qs.parse(queryString, {
      ignoreQueryPrefix: true
    }).id || ""
  );
};

const getRandom = (queryString: string): string => {
  return (
    qs.parse(queryString, {
      ignoreQueryPrefix: true
    }).random || ""
  );
};

const getCurrentLocation = (queryString: string): Location => {
  if (getQuery(queryString)) {
    return Location.Search;
  }

  if (getId(queryString)) {
    return Location.Detail;
  }

  if (getRandom(queryString)) {
    return Location.Random;
  }

  return Location.CapturedToday;
};

const getIsSessionId = (queryString: string): string | undefined => {
  let id = getId(queryString);
  return id.indexOf("session") >= 0 ? id : undefined;
};

const getRandomId = (): string => {
  let id = Math.floor(Math.random() * Math.floor(1000000000)).toString();
  return id;
};

export default {
  getIsLoadingOrError,
  getQuery,
  getId,
  getCurrentLocation,
  getIsSessionId,
  getRandomId
};
