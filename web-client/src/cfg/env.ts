const devApiUrl = "https://client-api-dev-dot-opit-193719.appspot.com";
const prodApiUrl = "https://client-api-prod-dot-opit-193719.appspot.com";
const localApiUrl = "http://localhost:8080";
const graphqlEndpoint = "graphql";
const dev = {
  REACT_APP_API_BASE_URL: devApiUrl,
  REACT_APP_GRAPHQL_URI: `${devApiUrl}/${graphqlEndpoint}`
};

const local = {
  REACT_APP_API_BASE_URL: localApiUrl,
  REACT_APP_GRAPHQL_URI: `${localApiUrl}/${graphqlEndpoint}`
};

const prod = {
  REACT_APP_API_BASE_URL: prodApiUrl,
  REACT_APP_GRAPHQL_URI: `${prodApiUrl}/${graphqlEndpoint}`
};

const config =
  process.env.REACT_APP_ENV === "production"
    ? prod
    : process.env.REACT_APP_ENV === "development"
      ? dev
      : local;

export default config;
