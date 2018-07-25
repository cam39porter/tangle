import { ApolloClient } from "apollo-client";
import { reportErrorMutationVariables } from "../__generated__/types";
import { reportError } from "../queries";
import { toast } from "react-toastify";

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

const errorToasts = {
  openSession: () => toast.error("There was an error opening your note!"),
  saveSession: () => toast.error("There was an error saving your note!"),
  createSession: () => toast.error("There was an error creating your note!")
};

export default {
  initializeCloudReporting,
  errorHandler,
  errorToasts
};
