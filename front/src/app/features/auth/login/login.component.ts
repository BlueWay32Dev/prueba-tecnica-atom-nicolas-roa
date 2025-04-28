import { Component, inject } from '@angular/core';
import {CommonModule} from "@angular/common";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from '@core/services/auth/auth.service'
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {ConfirmDialogComponent} from "@shared/components/dialog/confirm/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {firstValueFrom} from "rxjs";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatCard} from "@angular/material/card";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, MatInputModule, MatButtonModule, MatProgressSpinner, MatCard],
  templateUrl: 'login.component.html',
  styleUrl: 'login.component.scss'
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  }) as FormGroup<{
    email: FormControl<string>;
  }>;

  async onSubmit(){
    if(this.form.invalid) return;
    const email = this.form.value.email!;

    try {
      const loggedIn = await this.authService.login(email);
      if(!loggedIn) {
        const confirmed = await firstValueFrom(
          this.dialog.open(ConfirmDialogComponent, {
            data: {
              title: 'Crear Usuario',
              message: 'El usuario no existe. ¿Deseas crearlo?'
            }
          })
            .afterClosed()
        );

        if (confirmed) {
          const registered = await this.authService.register(email);
          if (!registered) {
            throw new Error('No se pudo crear el usuario');
          }
          this.snackBar.open('Usuario creado con éxito', 'Cerrar', {duration: 3000});
          this.router.navigate(['/tasks']);
        }
      }else{
        this.router.navigate(['/tasks'])
      }
    }catch (e) {
      this.snackBar.open('Ocurrió un error, inténtalo nuevamente', 'Cerrar', { duration: 3000});
    }
  }
}
