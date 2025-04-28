import {CreateTaskDto} from "../../../domain/dtos/task/create-task.dto";
import {UpdateTaskDto} from "../../../domain/dtos/task/update-task.dto";
import {TaskRepository} from "../../../domain/repository/task/task.repository";
import {Task} from "../../../domain/entities/task/task.entity";

/** Service for managing tasks */
export class TaskService {
  /**
   * Creates an instance of TaskService.
   * @param {TaskRepository} taskRepository Task repository
   */
  constructor(private readonly taskRepository: TaskRepository) {}

  /**
   * Creates a new task.
   * @param {CreateTaskDto} data Task data
   * @return {Promise<Task>}
   */
  async createTask(data: CreateTaskDto): Promise<Task> {
    return this.taskRepository.create(data);
  }

  /**
   * Retrieves tasks by user ID.
   * @param {string} userId User ID
   * @return {Promise<Task[]>}
   */
  async getTasksByUserId(userId: string): Promise<Task[]> {
    return this.taskRepository.findByUserId(userId);
  }

  /**
   * Updates an existing task.
   * @param {string} taskId Task ID
   * @param {UpdateTaskDto} data Updated task data
   * @return {Promise<Task | null>}
   */
  async updateTask(taskId: string, data: UpdateTaskDto): Promise<Task | null> {
    return this.taskRepository.update(taskId, data);
  }

  /**
   * Deletes a task.
   * @param {string} taskId Task ID
   * @return {Promise<void>}
   */
  async deleteTask(taskId: string): Promise<void> {
    return this.taskRepository.delete(taskId);
  }
}
