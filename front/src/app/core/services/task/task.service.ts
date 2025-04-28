import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@environments/environment";
import { Task } from "@core/models/task.dto";
import {AuthService} from "@core/services/auth/auth.service";
import {BehaviorSubject, firstValueFrom, Subject} from "rxjs";

@Injectable({
  providedIn: 'root',
})

export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly authService = inject(AuthService);

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  private taskToEditSubject = new BehaviorSubject<Task | null>(null);
  taskToEdit$ = this.taskToEditSubject.asObservable();

  setTaskToEdit(task: Task) {
    this.taskToEditSubject.next(task);
  }

  createTask(taskData: Task) {
      return firstValueFrom(
        this.http.post(`${this.apiUrl}/tasks/`, taskData, {
        headers: this.authService.getAuthHeaders()
      })
    );
  }

  async updateTask(taskId: string, taskData: Partial<Task>): Promise<void> {
    await firstValueFrom(
      this.http.put(`${this.apiUrl}/tasks/${taskId}`, taskData, {
        headers: this.authService.getAuthHeaders()
      })
    );
  }

  async deleteTask(taskId: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.apiUrl}/tasks/${taskId}`, {
        headers: this.authService.getAuthHeaders()
      })
    );
  }

  async getTasks(): Promise<Task[]> {
    return await firstValueFrom(
      this.http.get<Task[]>(`${this.apiUrl}/tasks`)
    );
  }

  async refreshTasks() {
    const tasks = await firstValueFrom(this.http.get<Task[]>(`${this.apiUrl}/tasks`, {
      headers: this.authService.getAuthHeaders()
    }));
    this.tasksSubject.next(tasks);
  }
}
