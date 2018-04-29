export class User {
  public id: string;
  public email: string;
  public name: string;
  constructor(id: string, email: string, name: string) {
    this.id = id;
    this.email = email;
    this.name = name;
  }
}
