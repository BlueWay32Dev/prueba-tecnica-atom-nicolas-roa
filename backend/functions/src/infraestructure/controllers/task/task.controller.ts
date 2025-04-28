import { Request, Response } from "express";
import { FirestoreTaskRepository } from "../../repositories/task/task.repository";
import { TaskService } from "../../../application/services/task/task.service";
import { CreateTaskDto } from "../../../domain/dtos/task/create-task.dto";
import { UpdateTaskDto } from "../../../domain/dtos/task/update-task.dto";
import { getUserIdFromRequest } from "../../../shared/jwt";

const taskRepo = new FirestoreTaskRepository();
const taskService = new TaskService(taskRepo);

export const createTaskHandler = async (
  request: Request,
  response: Response
) => {
  try {
    const userId = getUserIdFromRequest(request);
    const { title, description, completed } = request.body as CreateTaskDto;

    if (!userId || !title || !description) {
      console.log(request.body as CreateTaskDto);
      return response
        .status(400)
        .json({ message: "Todo los campos son requeridos." });
    }
    const task = await taskService.createTask({
      userId,
      title,
      description,
      completed,
    });

    return response.status(201).json(task);
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({ message: "Error interno al crear la tarea." });
  }
};

export const getTasksHandler = async (request: Request, response: Response) => {
  try {
    const userId = getUserIdFromRequest(request);
    const tasks = await taskService.getTasksByUserId(userId);
    return response.status(200).json(tasks);
  } catch (error: any) {
    console.error("Error al obtener tareas:", error.message || error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return response
        .status(401)
        .json({ message: "Token inválido o expirado." });
    }

    return response
      .status(500)
      .json({ message: "Error interno al obtener las tareas." });
  }
};

export const updateTaskHandler = async (
  request: Request,
  response: Response
) => {
  try {
    const { taskId } = request.params;
    const data = request.body as UpdateTaskDto;

    const task = await taskService.updateTask(taskId, data);

    if (!task) {
      return response.status(404).json({ message: "Tarea no encontrada." });
    }

    return response.status(200).json(task);
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({ message: "Error interno al actualizar la tarea." });
  }
};

export const deleteTaskHandler = async (
  request: Request,
  response: Response
) => {
  try {
    const { taskId } = request.params;
    await taskService.deleteTask(taskId);
    return response.status(200).json({ message: "Tarea eliminada." });
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({ message: "Error interno al eliminar la tarea." });
  }
};
