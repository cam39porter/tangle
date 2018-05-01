import { Graph } from "../surface/models/graph";
import { SearchResults } from "../surface/models/search-results";
import { getAllByUseCase, getNode } from "./services/capture";
import { search } from "./services/search";

export default {
  Query: {
    search(
      // @ts-ignore
      parent,
      { rawQuery, start, count },
      // @ts-ignore
      context,
      // @ts-ignore
      info
    ): Promise<SearchResults> {
      return search(rawQuery, start, count);
    },
    // @ts-ignore
    get(parent, { id }, context, info): Promise<Graph> {
      return getNode(id);
    },
    getAll(
      // @ts-ignore
      parent,
      { useCase, timezoneOffset },
      // @ts-ignore
      context,
      // @ts-ignore
      info
    ): Promise<SearchResults> {
      return getAllByUseCase(useCase, timezoneOffset);
    }
  }
};
