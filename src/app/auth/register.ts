// src/app/auth/register.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./login.css'],
})
export class RegisterComponent {
  form = {
    correo: '',
    nombre_usuario: '',
    contrasena: '',
    confirmarContrasena: '',
  };

  loading = false;
  error = '';
  mensaje = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.mensaje = '';

    const { correo, nombre_usuario, contrasena, confirmarContrasena } = this.form;

    if (!correo || !nombre_usuario || !contrasena || !confirmarContrasena) {
      this.error = 'Completa todos los campos';
      return;
    }

    if (nombre_usuario.length < 1 || nombre_usuario.length > 15) {
      this.error = 'El nombre de usuario debe tener entre 1 y 15 caracteres';
      return;
    }

    if (contrasena.length < 8 || contrasena.length > 20) {
      this.error = 'La contraseña debe tener entre 8 y 20 caracteres';
      return;
    }

    if (contrasena !== confirmarContrasena) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.loading = true;

    this.auth
      .register({
        correo,
        nombre_usuario,
        contrasena,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.error || 'Error al crear la cuenta';
        },
      });
  }
}
