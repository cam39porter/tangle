import { ApolloClient } from "apollo-client";
import { reportErrorMutationVariables } from "../__generated__/types";
import { reportError } from "../queries";

let errorHandler = {
  report: (message: String, stacktrace: Object) => {
    console.error(message, JSON.stringify(stacktrace));
  }
};

const initializeCloudReporting = (client: ApolloClient<Object>) => {
  errorHandler.report = (message: String, stacktrace: Object) => {
    client
      .mutate<reportErrorMutationVariables>({
        mutation: reportError,
        variables: {
          message: message,
          stacktrace: JSON.stringify(stacktrace)
        }
      })
      .catch(err => {
        console.error(err);
      });
  };
};

export default {
  initializeCloudReporting,
  errorHandler
};
