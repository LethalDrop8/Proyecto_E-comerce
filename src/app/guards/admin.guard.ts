import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const rol = localStorage.getItem('rol');

    if (rol === 'admin') {
      return true;
    }

    alert('No tienes permiso para acceder a esta sección.');
    this.router.navigate(['/catalogo']);
    return false;
  }
}
