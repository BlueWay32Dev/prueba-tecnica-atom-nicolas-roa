import { db } from "../../firebase/firestore.config";
import { TaskRepository } from "../../../domain/repository/task/task.repository";
import { Task } from "../../../domain/entities/task/task.entity";
import { CreateTaskDto } from "../../../domain/dtos/task/create-task.dto";
import { UpdateTaskDto } from "../../../domain/dtos/task/update-task.dto";

export class FirestoreTaskRepository implements TaskRepository {
  private collection = db.collection("tasks");

  async create(data: CreateTaskDto): Promise<Task> {
    const docRef = this.collection.doc();
    const createdAt = new Date();
    await docRef.set({ ...data, createdAt });

    return new Task(
      docRef.id,
      data.userId,
      data.title,
      data.description,
      data.completed,
      createdAt
    );
  }

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

  async update(taskId: string, data: UpdateTaskDto): Promise<Task | null> {
    const docRef = this.collection.doc(taskId);
    const doc = await docRef.get();

    if (!doc.exists) return null;

    await docRef.set(data, { merge: true });
    const updatedDoc = await docRef.get();
    const updatedData = updatedDoc.data();

    return new Task(
      taskId,
      updatedData!.userId,
      updatedData!.title,
      updatedData!.description,
      updatedData!.completed,
      updatedData!.createdAt.toDate()
    );
  }

  async delete(taskId: string): Promise<void> {
    await this.collection.doc(taskId).delete();
  }
}
