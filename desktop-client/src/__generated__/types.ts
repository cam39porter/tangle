/* tslint:disable */
//  This file was automatically generated and should not be edited.

export interface GetCapturesQuery {
  getCaptures:  Array< {
    __typename: "Capture",
    body: string,
    id: string,
  } >,
};

export interface CreateCaptureMutationVariables {
  body: string,
};

export interface CreateCaptureMutation {
  createCapture:  {
    __typename: "Capture",
    id: string,
    body: string,
  },
};
