import { Task } from "../../entities/task/task.entity";
import { CreateTaskDto } from "../../dtos/task/create-task.dto";
import { UpdateTaskDto } from "../../dtos/task/update-task.dto";

export interface TaskRepository {
  create(data: CreateTaskDto): Promise<Task>;
  findByUserId(userId: string): Promise<Task[]>;
  update(taskId: string, data: UpdateTaskDto): Promise<Task | null>;
  delete(taskId: string): Promise<void>;
}
