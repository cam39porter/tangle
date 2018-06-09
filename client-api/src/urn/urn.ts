export class Urn {
  protected id: string;
  protected type: string;

  constructor(id: string, type: string) {
    this.id = id;
    this.type = type;
  }

  public getId(): string {
    return this.id;
  }
  public getType(): string {
    return this.type;
  }
  public toString(): string {
    return `urn:hex:${this.type}:${this.id}`;
  }
}
