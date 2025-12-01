// src/api/controllers/catalogoController.js
import db from '../config/db.js';


export const obtenerProductos = async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, nombre, descripcion, precio, imagen, stock
       FROM productos
       WHERE activo = 1`
    );
    return res.json(rows);
  } catch (e) {
    console.error('❌ /api/catalogo DB_ERROR:', e);
    return res.status(500).json({ error: 'DB_ERROR', code: e.code, message: e.message });
  }
};


export const pingCatalogo = (_req, res) => {
  return res.json({ ok: true });
};


export const diagnosticoCatalogo = async (_req, res) => {
  try {
    const [[dbName]] = await db.query('SELECT DATABASE() AS db');
    const [tables] = await db.query('SHOW TABLES');
    const [[count]] = await db.query('SELECT COUNT(*) AS total FROM productos');
    return res.json({ db: dbName.db, tables, productos: count.total });
  } catch (e) {
    console.error('❌ /api/catalogo/diag error:', e);
    return res.status(500).json({ error: 'DIAG_ERROR', code: e.code, message: e.message });
  }
};

export const crearProducto = async (req, res) => {
  try {
    const { nombre, precio, descripcion, imagen, stock } = req.body;

    const [result] = await db.query(
      'INSERT INTO productos (nombre, precio, descripcion, imagen, stock) VALUES (?, ?, ?, ?, ?)',
      [nombre, precio, descripcion, imagen, stock]
    );

    res.json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear producto', detalles: err });
  }
};

export const actualizarProducto = async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre, precio, descripcion, imagen, stock } = req.body;

    await db.query(
      'UPDATE productos SET nombre=?, precio=?, descripcion=?, imagen=?, stock=? WHERE id=?',
      [nombre, precio, descripcion, imagen, stock, id]
    );

    res.json({ id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const id = req.params.id;

    await db.query('DELETE FROM productos WHERE id=?', [id]);

    res.json({ message: 'Producto eliminado', id });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};
