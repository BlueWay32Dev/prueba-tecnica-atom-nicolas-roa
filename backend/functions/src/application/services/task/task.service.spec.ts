import { TaskService } from "../../../application/services/task/task.service";
import { TaskRepository } from "../../../domain/repository/task/task.repository";
import { Task } from "../../../domain/entities/task/task.entity";
import { CreateTaskDto } from "../../../domain/dtos/task/create-task.dto";
import { UpdateTaskDto } from "../../../domain/dtos/task/update-task.dto";

describe("TaskService", () => {
  const mockTaskRepository: jest.Mocked<TaskRepository> = {
    create: jest.fn(),
    findByUserId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as any;

  let taskService: TaskService;
  const mockUserId = "user-123";
  const mockTaskId = "task-456";
  const mockTask = {
    id: mockTaskId,
    title: "Tarea prueba",
    userId: mockUserId,
  } as Task;
  const mockTasks = [mockTask];
  const mockCreateTaskDto: CreateTaskDto = {
    title: "Tarea prueba",
    userId: mockUserId,
    description: "description de prueba",
    completed: false,
  };
  const mockUpdateTaskDto: UpdateTaskDto = {
    title: "Tarea actualizada (nuevo titulo)",
  };

  beforeEach(() => {
    taskService = new TaskService(mockTaskRepository);
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    it("Debe crear una tarea y devolverla", async () => {
      mockTaskRepository.create.mockResolvedValue(mockTask);

      const result = await taskService.createTask(mockCreateTaskDto);

      expect(mockTaskRepository.create).toHaveBeenCalledWith(mockCreateTaskDto);
      expect(result).toEqual(mockTask);
    });
  });

  describe("getTasksByUserId", () => {
    it("Debe devolver las tareas segun el id del usuario", async () => {
      mockTaskRepository.findByUserId.mockResolvedValue(mockTasks);

      const result = await taskService.getTasksByUserId(mockUserId);

      expect(mockTaskRepository.findByUserId).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockTasks);
    });
  });

  describe("updateTask", () => {
    it("Debe actualizar la tarea y devolver la tarea actualizada", async () => {
      const updatedTask = { ...mockTask, title: "Updated Task" };
      mockTaskRepository.update.mockResolvedValue(updatedTask);

      const result = await taskService.updateTask(
        mockTaskId,
        mockUpdateTaskDto
      );

      expect(mockTaskRepository.update).toHaveBeenCalledWith(
        mockTaskId,
        mockUpdateTaskDto
      );
      expect(result).toEqual(updatedTask);
    });

    it("Debe devolver null si la tarea no es encontrada", async () => {
      mockTaskRepository.update.mockResolvedValue(null);

      const result = await taskService.updateTask(
        "non-existent-id",
        mockUpdateTaskDto
      );

      expect(mockTaskRepository.update).toHaveBeenCalledWith(
        "non-existent-id",
        mockUpdateTaskDto
      );
      expect(result).toBeNull();
    });
  });

  describe("deleteTask", () => {
    it("Debe eliminar la tarea", async () => {
      mockTaskRepository.delete.mockResolvedValue();

      await taskService.deleteTask(mockTaskId);

      expect(mockTaskRepository.delete).toHaveBeenCalledWith(mockTaskId);
    });
  });
});
