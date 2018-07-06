import { ApolloClient } from "apollo-client";
import { deleteCaptureMutationVariables } from "../__generated__/types";
import { deleteCapture } from "../queries";

let errorHandler = { report: console.error };

const initialize = (client: ApolloClient<any>) => {
  if (process.env.REACT_APP_ENV === "production") {
    errorHandler.report = (error: Error, errorInfo: object) => {
      client
        .mutate<deleteCaptureMutationVariables>({
          mutation: deleteCapture,
          variables: {
            id: "test"
          }
        })
        .catch(err => {
          console.error(err);
        });
    };
  }
};

export default {
  initialize,
  errorHandler
};
