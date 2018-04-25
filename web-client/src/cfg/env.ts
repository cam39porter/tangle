const dev = {
  REACT_APP_GRAPHQL_URI:
    "https://client-api-dev-dot-opit-193719.appspot.com/graphql"
};

const prod = {
  REACT_APP_GRAPHQL_URI:
    "https://client-api-prod-dot-opit-193719.appspot.com/graphql"
};

const config = process.env.REACT_APP_ENV === "production" ? prod : dev;

export default config;
