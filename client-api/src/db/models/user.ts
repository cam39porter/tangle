import { UserUrn } from "../../urn/user-urn";

export class User {
  public urn: UserUrn;
  public email: string;
  public name: string;
  public readPermissionedUsers: UserUrn[];
  constructor(
    urn: UserUrn,
    email: string,
    name: string,
    readPermissionedUsers: UserUrn[]
  ) {
    this.urn = urn;
    this.email = email;
    this.name = name;
    this.readPermissionedUsers = readPermissionedUsers;
  }
}
