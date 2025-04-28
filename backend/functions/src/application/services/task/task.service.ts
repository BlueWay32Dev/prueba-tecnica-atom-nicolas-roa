import { CreateTaskDto } from "../../../domain/dtos/task/create-task.dto";
import { UpdateTaskDto } from "../../../domain/dtos/task/update-task.dto";
import { TaskRepository } from "../../../domain/repository/task/task.repository";
import { Task } from "../../../domain/entities/task/task.entity";

export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask(data: CreateTaskDto): Promise<Task> {
    return this.taskRepository.create(data);
  }

  async getTasksByUserId(userId: string): Promise<Task[]> {
    return this.taskRepository.findByUserId(userId);
  }

  async updateTask(taskId: string, data: UpdateTaskDto): Promise<Task | null> {
    return this.taskRepository.update(taskId, data);
  }

  async deleteTask(taskId: string): Promise<void> {
    return this.taskRepository.delete(taskId);
  }
}
