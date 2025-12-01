//inventario.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InventarioService } from '../inventario/inventario.service';
import { Product } from '../models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  productos: Product[] = [];
  productoSeleccionado: Product | null = null;
  modoEdicion = false;
  esAdmin = false;

  nuevoProducto: Product = {
    id: 0,
    nombre: '',
    precio: 0,
    descripcion: '',
    imagen: '',
    stock: 0
  };

  constructor(
    private inventarioService: InventarioService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.esAdmin = localStorage.getItem('rol') === 'admin';

  
    this.inventarioService.productos$.subscribe(productos => {
      this.productos = productos;
    });
  }

  agregarProducto(): void {
    if (this.validarProducto(this.nuevoProducto)) {
      this.inventarioService.agregarProducto({ ...this.nuevoProducto });
      this.resetearFormulario();
    } else {
      alert('Por favor, completa todos los campos antes de agregar un producto.');
    }
  }



  seleccionarProducto(producto: Product): void {
    this.productoSeleccionado = { ...producto };
    this.modoEdicion = true;
  }

  actualizarProducto(): void {
    if (this.productoSeleccionado && this.validarProducto(this.productoSeleccionado)) {
      this.inventarioService.actualizarProducto(this.productoSeleccionado);
      this.cancelarEdicion();
    } else {
      alert('Por favor, completa todos los campos correctamente antes de actualizar.');
    }
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.inventarioService.eliminarProducto(id);
      if (this.productoSeleccionado?.id === id) {
        this.cancelarEdicion();
      }
    }
  }

  cancelarEdicion(): void {
    this.productoSeleccionado = null;
    this.modoEdicion = false;
  }

  resetearFormulario(): void {
    this.nuevoProducto = {
      id: 0,
      nombre: '',
      precio: 0,
      descripcion: '',
      imagen: '',
      stock: 0,
    };
  }

  private validarProducto(producto: Product): boolean {
    return !!producto.nombre
      && producto.precio > 0
      && String(producto.descripcion).trim() !== '';
  }

  descargarInventario(): void {
    alert('Función descargar inventario aún no implementada.');
  }

  verPedidos(): void {
    alert('Función ver pedidos aún no implementada.');
  }
}
