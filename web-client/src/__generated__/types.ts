/* tslint:disable */
//  This file was automatically generated and should not be edited.

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

export interface GetCapturesQuery {
  getCaptures:  Array< {
    __typename: "Capture",
    body: string,
    id: string,
  } >,
};

export interface SearchQueryVariables {
  query: string,
};

export interface SearchQuery {
  search:  {
    __typename: "CaptureCollection",
    results:  Array< {
      __typename: "Capture",
      body: string,
      id: string,
    } >,
  },
};
