export class RecommendationReason {
  public reasonType: string;
  public pivot: string;
  constructor(reasonType: string, pivot: string) {
    this.reasonType = reasonType;
    this.pivot = pivot;
  }
}
