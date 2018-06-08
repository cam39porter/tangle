import { SurfaceResults } from "./models/surface-results";
import { getAllByUseCase, getNode, getAllMostRecent } from "./services/graph";
import { search } from "./services/search";
import { PageInfo } from "./models/page-info";

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
    ): Promise<SurfaceResults> {
      return search(rawQuery, start, count);
    },
    // @ts-ignore
    getDetailed(parent, { id }, context, info): Promise<SurfaceResults> {
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
    ): Promise<SurfaceResults> {
      return getAllByUseCase(useCase, timezoneOffset);
    },
    getMostRecent(
      // @ts-ignore
      parent,
      { start, count },
      // @ts-ignore
      context,
      // @ts-ignore
      info
    ): Promise<SurfaceResults> {
      return getAllMostRecent(start, count).then(searchResults => {
        searchResults.pageInfo = new PageInfo(start, count, null);
        return searchResults;
      });
    }
  }
};
