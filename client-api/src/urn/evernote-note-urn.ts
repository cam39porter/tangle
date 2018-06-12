import { Urn } from "./urn";

export class EvernoteNoteUrn extends Urn {
  public static fromRaw(raw: string): EvernoteNoteUrn {
    return new EvernoteNoteUrn(raw.split(":")[3]);
  }
  constructor(id: string) {
    super(id, "evernoteNote");
  }
}
