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

const getFormat = (queryString: string): string => {
  return (
    qs.parse(queryString, {
      ignoreQueryPrefix: true
    }).format || ""
  );
};

export default {
  getQuery,
  getCapture,
  getFormat
};
