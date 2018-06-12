export class Urn {
  public static fromRaw(raw: string): Urn {
    return new Urn(raw.split(":")[3], raw.split(":")[2]);
  }

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
  public toRaw(): string {
    return `urn:hex:${this.type}:${this.id}`;
  }
}
