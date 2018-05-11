import { AnnotatedText } from "./annotated-text";
import { RecommendationReason } from "./recommendation-reason";

export class ListItem {
  public id: string;
  public text: AnnotatedText;
  public reasons: RecommendationReason[];
  public relatedItems: ListItem[];
  constructor(
    id: string,
    text: AnnotatedText,
    reasons: RecommendationReason[],
    relatedItems: ListItem[]
  ) {
    this.id = id;
    this.text = text;
    this.reasons = reasons;
    this.relatedItems = relatedItems;
  }
}
