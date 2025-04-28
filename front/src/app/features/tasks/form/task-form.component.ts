import { Component, inject } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { Router } from "@angular/router";
import { AuthService } from "@core/services/auth/auth.service";
import { Task } from "@core/models/task.dto";
import { TaskService } from "@core/services/task/task.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule, MatCardModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private taskService = inject(TaskService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  form: FormGroup = this.formBuilder.group({
    id: [''],
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    completed: [false]
  }) as FormGroup<{
    id: FormControl<string | null>,
    title: FormControl<Task['title']>,
    description: FormControl<Task['description']>,
    completed: FormControl<Task['completed']>
  }>;

  constructor() {
    this.taskService.taskToEdit$.subscribe((task) => {
      if (task) {
        this.form.patchValue(task);
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    try {
      if (this.form.value.id) {
        await this.taskService.updateTask(this.form.value.id, this.form.value);
        this.snackBar.open('Tarea actualizada correctamente.', 'Cerrar', { duration: 3000 });
      } else {
        await this.taskService.createTask(this.form.value);
        this.snackBar.open('Tarea creada correctamente.', 'Cerrar', { duration: 3000 });
      }
      await this.taskService.refreshTasks();
      this.form.reset({ completed: false });
    } catch (error) {
      console.error('Error al enviar la tarea: ', error);
      this.snackBar.open('Error al crear/actualizar la tarea.', 'Cerrar', { duration: 3000 });
    }
  }

  goToLogin(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
