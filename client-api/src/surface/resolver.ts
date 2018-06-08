import { SearchResults } from "../surface/models/search-results";
import { getAllByUseCase, getNode } from "./services/graph";
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
    getDetailed(parent, { id }, context, info): Promise<SearchResults> {
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
