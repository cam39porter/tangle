import { Capture } from "./capture";
import { PageInfo } from "./page-info";

export class CaptureCollection {
  results: Capture[];
  pageInfo: PageInfo;
  constructor(results: Capture[], pageInfo: PageInfo) {
    this.results = results;
    this.pageInfo = pageInfo;
  }
}
