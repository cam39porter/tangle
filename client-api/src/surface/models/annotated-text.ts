import { Annotation } from "./annotation";

export class AnnotatedText {
  public text: string;
  public annotations: Annotation[];
  constructor(text: string, annotations: Annotation[]) {
    this.text = text;
    this.annotations = annotations;
  }
}
