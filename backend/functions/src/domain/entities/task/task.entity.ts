/** Task entity */
export class Task {
  /**
   * Constructor for Task
   * @param {string} id Task ID
   * @param {string} userId User ID
   * @param {string} title Task title
   * @param {string} description Task description
   * @param {boolean} completed Task completion status
   * @param {Date} createdAt Task creation date
   */
  constructor(
    public id: string,
    public userId: string,
    public title: string,
    public description: string,
    public completed: boolean,
    public createdAt: Date
  ) {}
}
