import { FirestoreTaskRepository } from "./task.repository";
import { Task } from "../../../domain/entities/task/task.entity";
import { CreateTaskDto } from "../../../domain/dtos/task/create-task.dto";
import { UpdateTaskDto } from "../../../domain/dtos/task/update-task.dto";
import { db } from "../../firebase/firestore.config";

jest.mock("../../firebase/firestore.config", () => ({
  db: {
    collection: jest.fn(),
  },
}));

describe("FirestoreTaskRepository", () => {
  let repository: FirestoreTaskRepository;
  const mockCollection = {
    doc: jest.fn(),
    where: jest.fn(),
  };
  const mockDocRef = {
    id: "task-123",
    set: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  };
  const mockWhereRef = {
    get: jest.fn(),
  };
  const userId = "user-123";
  const taskTitle = "Tarea de prueba";
  const taskDescription = "Descripción de prueba";
  const taskCompleted = false;
  const createdAt = new Date();

  beforeEach(() => {
    jest.clearAllMocks();
    (db.collection as jest.Mock).mockReturnValue(mockCollection);
    mockCollection.doc.mockReturnValue(mockDocRef);
    mockCollection.where.mockReturnValue(mockWhereRef);
    repository = new FirestoreTaskRepository();
  });

  describe("create", () => {
    it("Debe crear una nueva tarea en Firestore", async () => {
      const taskData: CreateTaskDto = {
        userId,
        title: taskTitle,
        description: taskDescription,
        completed: taskCompleted,
      };

      mockDocRef.set.mockResolvedValueOnce(undefined);

      const result = await repository.create(taskData);

      expect(db.collection).toHaveBeenCalledWith("tasks");
      expect(mockCollection.doc).toHaveBeenCalled();
      expect(mockDocRef.set).toHaveBeenCalledWith({
        ...taskData,
        createdAt: expect.any(Date),
      });
      expect(result).toBeInstanceOf(Task);
      expect(result.id).toBe("task-123");
      expect(result.userId).toBe(userId);
      expect(result.title).toBe(taskTitle);
      expect(result.description).toBe(taskDescription);
      expect(result.completed).toBe(taskCompleted);
      expect(result.createdAt).toBeInstanceOf(Date);
    });
  });

  describe("findByUserId", () => {
    it("Debe devolver las tareas a un usuario en especifico", async () => {
      const mockDocs = [
        {
          id: "task-123",
          data: () => ({
            title: taskTitle,
            description: taskDescription,
            completed: taskCompleted,
            createdAt: { toDate: () => createdAt },
          }),
        },
        {
          id: "task-456",
          data: () => ({
            title: "Otra tarea",
            description: "Otra descripción",
            completed: true,
            createdAt: { toDate: () => createdAt },
          }),
        },
      ];

      mockWhereRef.get.mockResolvedValueOnce({ docs: mockDocs });

      const result = await repository.findByUserId(userId);

      expect(db.collection).toHaveBeenCalledWith("tasks");
      expect(mockCollection.where).toHaveBeenCalledWith("userId", "==", userId);
      expect(mockWhereRef.get).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Task);
      expect(result[0].id).toBe("task-123");
      expect(result[1].id).toBe("task-456");
    });

    it("Debe devolver un array vacio cuando no hayan tareas", async () => {
      mockWhereRef.get.mockResolvedValueOnce({ docs: [] });
      const result = await repository.findByUserId(userId);

      expect(result).toEqual([]);
    });
  });

  describe("update", () => {
    it("debe actualizar la tarea existente", async () => {
      const updateData: UpdateTaskDto = {
        title: "Updated Title",
        completed: true,
      };

      mockDocRef.get.mockResolvedValueOnce({
        exists: true,
      });

      mockDocRef.set.mockResolvedValueOnce(undefined);

      mockDocRef.get.mockResolvedValueOnce({
        data: () => ({
          userId,
          title: "Nuevo titulo",
          description: taskDescription,
          completed: true,
          createdAt: { toDate: () => createdAt },
        }),
      });

      const result = await repository.update("task-123", updateData);

      expect(db.collection).toHaveBeenCalledWith("tasks");
      expect(mockCollection.doc).toHaveBeenCalledWith("task-123");
      expect(mockDocRef.set).toHaveBeenCalledWith(updateData, { merge: true });
      expect(result).toBeInstanceOf(Task);
      expect(result?.title).toBe("Nuevo titulo");
      expect(result?.completed).toBe(true);
    });

    it("Debe devolver null cuando la tarea no existe", async () => {
      mockDocRef.get.mockResolvedValueOnce({ exists: false });

      const result = await repository.update("non-existent-id", {
        title: "Nuevo titulo",
      });

      expect(result).toBeNull();
      expect(mockDocRef.set).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("Debe eliminar la tarea", async () => {
      mockDocRef.delete.mockResolvedValueOnce(undefined);

      await repository.delete("task-123");

      expect(db.collection).toHaveBeenCalledWith("tasks");
      expect(mockCollection.doc).toHaveBeenCalledWith("task-123");
      expect(mockDocRef.delete).toHaveBeenCalled();
    });
  });
});
