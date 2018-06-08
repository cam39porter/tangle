import { Capture } from "../../db/models/capture";
import { PageInfo } from "./page-info";

export class SearchResults {
  public results: Capture[];
  public pageInfo: PageInfo;
  constructor(results: Capture[], pageInfo: PageInfo) {
    this.results = results;
    this.pageInfo = pageInfo;
  }
}
