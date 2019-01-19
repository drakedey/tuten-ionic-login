export class User {
    public firstName: string;
    public lastName: string;
    public email: string;
    public token: string;

    constructor(firstName: string, lastName: string, email: string, token: string) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email
      this.token = token
    }
  }
