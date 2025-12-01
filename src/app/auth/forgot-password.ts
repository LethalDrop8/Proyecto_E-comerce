import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css'],
})
export class ForgotPasswordComponent {
 
  paso: 1 | 2 = 1;

 
  correo = '';

  
  codigo = '';
  nuevaContrasena = '';
  confirmarContrasena = '';

  loading = false;
  error = '';
  mensaje = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

 
  enviarCorreo(): void {
    this.error = '';
    this.mensaje = '';

    if (!this.correo) {
      this.error = 'Escribe tu correo';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.correo)) {
      this.error = 'Correo inválido';
      return;
    }

    this.loading = true;

    this.auth.forgot(this.correo).subscribe({
      next: (res) => {
        this.loading = false;
        this.mensaje =
          res?.message ||
          'Si el correo existe, se generó un código de recuperación.';
        
        this.paso = 2;
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.error?.error ||
          err?.error?.message ||
          'Error al solicitar recuperación';
      },
    });
  }


  cambiarContrasena(): void {
    this.error = '';
    this.mensaje = '';

    if (!this.correo) {
      this.error = 'Falta el correo (regresa al paso anterior)';
      this.paso = 1;
      return;
    }

    if (!this.codigo) {
      this.error = 'Escribe el código que te llegó';
      return;
    }

    if (!this.nuevaContrasena || !this.confirmarContrasena) {
      this.error = 'Escribe y confirma la nueva contraseña';
      return;
    }

    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    if (
      this.nuevaContrasena.length < 8 ||
      this.nuevaContrasena.length > 20
    ) {
      this.error = 'La contraseña debe tener entre 8 y 20 caracteres';
      return;
    }

    this.loading = true;

    this.auth
      .reset({
        correo: this.correo,
        codigo: this.codigo,
        nuevaContrasena: this.nuevaContrasena,
      })
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.mensaje =
            res?.message || 'Contraseña actualizada correctamente';
          
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          this.error =
            err?.error?.error ||
            err?.error?.message ||
            'Error al restablecer la contraseña';
        },
      });
  }

  
  volverPaso1(): void {
    this.paso = 1;
    this.codigo = '';
    this.nuevaContrasena = '';
    this.confirmarContrasena = '';
    this.error = '';
    this.mensaje = '';
  }
}
