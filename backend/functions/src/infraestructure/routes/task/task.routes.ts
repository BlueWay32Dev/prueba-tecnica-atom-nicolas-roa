import {Router} from "express";
import {
  createTaskHandler,
  getTasksHandler,
  updateTaskHandler,
  deleteTaskHandler,
} from "../../controllers/task/task.controller";

// eslint-disable-next-line new-cap
export const taskRoutes = Router();

taskRoutes.post("/", createTaskHandler);
taskRoutes.get("/", getTasksHandler);
taskRoutes.put("/:taskId", updateTaskHandler);
taskRoutes.delete("/:taskId", deleteTaskHandler);
