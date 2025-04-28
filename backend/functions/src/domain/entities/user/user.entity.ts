export class User {
  constructor(
    public id: string,
    public email: string,
    public createdAt: Date
  ) {}

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
