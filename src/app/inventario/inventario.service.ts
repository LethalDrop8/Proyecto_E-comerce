//inventario.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private productosSubject = new BehaviorSubject<Product[]>([]);
  productos$ = this.productosSubject.asObservable();

  private apiUrl = 'http://localhost:4000/api/catalogo'; 

  constructor(private http: HttpClient) {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al cargar productos:', error);
        return of([]); 
      })
    ).subscribe(productos => {
      this.productosSubject.next(productos);
    });
  }

  getCantidadDisponible(id: number): number {
    let cantidad = 0;
    this.productos$.subscribe(productos => {
      const producto = productos.find(p => p.id === id);
      cantidad = producto ? producto.stock : 0;  // Devuelve la cantidad disponible o 0 si no se encuentra
    }).unsubscribe();
    return cantidad;
  }

  agregarProducto(producto: Product): void {
    this.http.post<Product>(this.apiUrl, producto).subscribe({
      next: nuevoProducto => {
        const productos = this.productosSubject.value;
        this.productosSubject.next([...productos, nuevoProducto]);
      },
      error: err => {
        console.error('Error al agregar producto:', err);
      }
    });
  }

  actualizarProducto(producto: Product): void {
    this.http.put<Product>(`${this.apiUrl}/${producto.id}`, producto).subscribe({
      next: productoActualizado => {
        const productos = this.productosSubject.value;
        const index = productos.findIndex(p => p.id === productoActualizado.id);
        if (index !== -1) {
          productos[index] = productoActualizado;
          this.productosSubject.next([...productos]);
        }
      },
      error: err => {
        console.error('Error al actualizar producto:', err);
      }
    });
  }

  eliminarProducto(id: number): void {
    this.http.delete<{ message: string, id: number }>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        const productos = this.productosSubject.value.filter(p => p.id !== id);
        this.productosSubject.next(productos);
      },
      error: err => {
        console.error('Error al eliminar producto:', err);
      }
    });
  }
}