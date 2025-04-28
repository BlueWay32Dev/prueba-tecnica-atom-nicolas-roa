import {db} from "../../firebase/firestore.config";
import {TaskRepository} from "../../../domain/repository/task/task.repository";
import {Task} from "../../../domain/entities/task/task.entity";
import {CreateTaskDto} from "../../../domain/dtos/task/create-task.dto";
import {UpdateTaskDto} from "../../../domain/dtos/task/update-task.dto";

/** Firestore implementation for Task repository */
export class FirestoreTaskRepository implements TaskRepository {
  private collection = db.collection("tasks");

  /**
   * Create a new task.
   * @param {CreateTaskDto} data Task data
   * @return {Promise<Task>}
   */
  async create(data: CreateTaskDto): Promise<Task> {
    const docRef = this.collection.doc();
    const createdAt = new Date();
    await docRef.set({...data, createdAt});

    return new Task(
      docRef.id,
      data.userId,
      data.title,
      data.description,
      data.completed,
      createdAt
    );
  }

  /**
   * Find tasks by user ID.
   * @param {string} userId User ID
   * @return {Promise<Task[]>}
   */
  async findByUserId(userId: string): Promise<Task[]> {
    const snapshot = await this.collection.where("userId", "==", userId).get();
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return new Task(
        doc.id,
        userId,
        data.title,
        data.description,
        data.completed,
        data.createdAt.toDate()
      );
    });
  }

  /**
   * Update a task.
   * @param {string} taskId Task ID
   * @param {UpdateTaskDto} data Task update data
   * @return {Promise<Task | null>}
   */
  async update(taskId: string, data: UpdateTaskDto): Promise<Task | null> {
    const docRef = this.collection.doc(taskId);
    const doc = await docRef.get();

    if (!doc.exists) return null;

    await docRef.set(data, {merge: true});
    const updatedDoc = await docRef.get();
    const updatedData = updatedDoc.data();

    if (!updatedData) return null;

    return new Task(
      taskId,
      updatedData.userId,
      updatedData.title,
      updatedData.description,
      updatedData.completed,
      updatedData.createdAt.toDate()
    );
  }

  /**
   * Delete a task.
   * @param {string} taskId Task ID
   * @return {Promise<void>}
   */
  async delete(taskId: string): Promise<void> {
    await this.collection.doc(taskId).delete();
  }
}
