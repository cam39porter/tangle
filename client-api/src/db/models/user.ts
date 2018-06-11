import { UserUrn } from "../../urn/user-urn";

export class User {
  public urn: UserUrn;
  public email: string;
  public name: string;
  constructor(urn: UserUrn, email: string, name: string) {
    this.urn = urn;
    this.email = email;
    this.name = name;
  }
}
