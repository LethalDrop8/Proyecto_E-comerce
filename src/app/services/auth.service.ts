import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Usuario {
  id: number;
  nombre_usuario: string;
  correo: string;
  rol: 'usuario' | 'admin';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiBase = 'http://localhost:4000/api/auth';

  constructor(private http: HttpClient) {}

  register(data: {
    nombre_usuario: string;
    correo: string;
    contrasena: string;
    nombre_completo?: string;
    rfc?: string;
    regimen_fiscal?: string;
  }): Observable<{ ok: boolean; usuario: Usuario }> {
    return this.http.post<{ ok: boolean; usuario: Usuario }>(
      `${this.apiBase}/register`,
      data
    );
  }

  login(data: {
    correo: string;
    nombre_usuario: string;
    contrasena: string;
  }): Observable<{ ok: boolean; usuario: Usuario }> {
    return this.http.post<{ ok: boolean; usuario: Usuario }>(
      `${this.apiBase}/login`,
      data
    );
  }

  forgot(correo: string): Observable<{ ok: boolean; message: string }> {
    return this.http.post<{ ok: boolean; message: string }>(
      `${this.apiBase}/forgot`,
      { correo }
    );
  }

  reset(data: {
    correo: string;
    codigo: string;
    nuevaContrasena: string;
  }): Observable<{ ok: boolean; message: string }> {
    return this.http.post<{ ok: boolean; message: string }>(
      `${this.apiBase}/reset`,
      data
    );
  }
}
