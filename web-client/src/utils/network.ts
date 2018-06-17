import qs from "query-string";

// URLs
const getQuery = (queryString: string): string => {
  return (
    qs.parse(queryString, {
      ignoreQueryPrefix: true
    }).query || ""
  );
};

const getCapture = (queryString: string): string => {
  return (
    qs.parse(queryString, {
      ignoreQueryPrefix: true
    }).capture || ""
  );
};

export default {
  getQuery,
  getCapture
};
