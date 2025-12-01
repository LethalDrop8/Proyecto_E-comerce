// src/app/app.routes.ts

import { Routes } from '@angular/router';


import { CatalogoComponent } from './catalogo/catalogo';
import { CarritoComponent } from './carrito/carrito';


import { LoginComponent } from './auth/login';
import { ForgotPasswordComponent } from './auth/forgot-password';
import { RegisterComponent } from './auth/register';

import { Terminos } from './pages/terminos/terminos';
import { Privacidad } from './pages/privacidad/privacidad';

import { InventarioComponent } from './inventario/inventario.component';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot', component: ForgotPasswordComponent },

  { path: 'catalogo', component: CatalogoComponent },
  { path: 'carrito', component: CarritoComponent },

  { path: 'terminos-y-condiciones', component: Terminos },
  { path: 'aviso-de-privacidad', component: Privacidad },

  { path: '', redirectTo: 'register', pathMatch: 'full' },

  { path: 'inventario', 
  component: InventarioComponent,
  canActivate: [AdminGuard] },
  
  { path: '**', redirectTo: 'register' },
];