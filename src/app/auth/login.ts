// src/app/auth/login.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  form = {
    correo: '',
    nombre_usuario: '',
    contrasena: '',
  };

  loading = false;
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.error = '';

    const { correo, nombre_usuario, contrasena } = this.form;

    // Validaciones básicas
    if (!correo || !nombre_usuario || !contrasena) {
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

    this.loading = true;

    this.auth.login({ correo, nombre_usuario, contrasena }).subscribe({
     next: (res) => {
  this.loading = false;


  if (res?.usuario) {
    localStorage.setItem('user', JSON.stringify(res.usuario));
    localStorage.setItem('rol', res.usuario.rol);
    localStorage.setItem('usuario', res.usuario.nombre_usuario);
  }

  this.router.navigate(['/catalogo']);
},
    });
  }
}
