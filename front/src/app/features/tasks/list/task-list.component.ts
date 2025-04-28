import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '@core/services/task/task.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Task } from '@core/models/task.dto';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  tasks$ = this.taskService.tasks$;
  loadingTaskId: string | null = null;

  async ngOnInit() {
    try {
      await this.taskService.refreshTasks();
    } catch (error) {
      console.error('Error al cargar tareas iniciales', error);
    }
  }

  async deleteTask(taskId: string) {
    try {
      this.loadingTaskId = taskId;
      await this.taskService.deleteTask(taskId);
      await this.taskService.refreshTasks();
    } catch (error) {
      console.error('Error al eliminar tarea', error);
    } finally {
      this.loadingTaskId = null;
    }
  }

  async toggleCompleted(task: Task) {
    try {
      this.loadingTaskId = task.id!;
      await this.taskService.updateTask(task.id!, { completed: !task.completed });
      await this.taskService.refreshTasks();
    } catch (error) {
      console.error('Error al actualizar tarea', error);
    } finally {
      this.loadingTaskId = null;
    }
  }

  editTask(task: Task) {
    this.taskService.setTaskToEdit(task);
  }
}
