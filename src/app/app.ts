import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { CarritoIndicadorComponent } from './carrito/carrito-indicador.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, CarritoIndicadorComponent],
  template: `

    <nav class="navbar-panaderia">
      <div class="nav-container">

        <a routerLink="/" class="nav-logo">
          °❀⋆.ೃ࿔*:･ Panadería de Panes ･*:.ೃ࿔
        </a>

        <div class="nav-links" *ngIf="showMainMenu">
          <a routerLink="/catalogo" routerLinkActive="active" class="nav-link">Catálogo</a>
          <a routerLink="/carrito" routerLinkActive="active" class="nav-link">Carrito</a>
          <a routerLink="/inventario" routerLinkActive="active" class="nav-link"> Inventario</a>
        </div>


        <div class="user-dropdown dropdown" *ngIf="showMainMenu">
          <button 
            class="user-btn dropdown-toggle" 
            type="button" 
            data-bs-toggle="dropdown" 
            aria-expanded="false">
            <i class="bi bi-person-circle"></i>
          </button>

          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" routerLink="/perfil">Modificar datos</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" routerLink="/aviso-de-privacidad">Aviso de privacidad</a></li>
            <li><a class="dropdown-item" routerLink="/terminos-y-condiciones">Términos y condiciones</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item text-danger" (click)="cerrarSesion()">Cerrar sesión</button></li>
          </ul>
        </div>

      </div>
    </nav>

    <main class="main-content">
      <router-outlet></router-outlet>
    </main>

    <app-carrito-indicador *ngIf="showMainMenu"></app-carrito-indicador>
  `
})
export class AppComponent {
  showMainMenu = true;
  esAdmin = false;   // NECESARIO

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        const url = e.urlAfterRedirects;
        const esAuth = url.startsWith('/login') || url.startsWith('/register') || url.startsWith('/forgot');

        this.showMainMenu = !esAuth;

        // detectar rol siempre
        this.esAdmin = localStorage.getItem('rol') === 'admin';
      });
  }

  cerrarSesion() {
    if (confirm('¿Cerrar sesión?')) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}
