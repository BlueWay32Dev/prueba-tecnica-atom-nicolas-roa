/** User entity */
export class User {
  /**
   * Constructor for User
   * @param {string} id User ID
   * @param {string} email User email
   * @param {Date} createdAt User creation date
   */
  constructor(
    public id: string,
    public email: string,
    public createdAt: Date
  ) {}

  /**
   * Converts User to JSON format
   * @return {{id: string, email: string, createdAt: string}}
   */
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
