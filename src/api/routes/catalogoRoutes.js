import { Router } from 'express';
import {
  obtenerProductos,
  pingCatalogo,
  diagnosticoCatalogo,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/catalogoController.js';

const router = Router();

router.get('/', obtenerProductos);
router.post('/', crearProducto);

router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

router.get('/test', pingCatalogo);
router.get('/diag', diagnosticoCatalogo);

export default router;
