// src/api/controllers/authController.js
import db from '../config/db.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';


let transporter = null;

if (
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS
) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  console.log('📧 SMTP activado con host:', process.env.SMTP_HOST);
} else {
  console.log(
    '📧 SMTP NO configurado, se usará modo DEMO (código de recuperación solo en consola).'
  );
}

function isEmail(str = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}


export const registrarUsuario = async (req, res) => {
  try {
    const { correo, nombre_usuario, contrasena } = req.body || {};

    if (!correo || !nombre_usuario || !contrasena) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    if (!isEmail(correo)) {
      return res.status(400).json({ error: 'Correo inválido' });
    }
    if (nombre_usuario.length < 1 || nombre_usuario.length > 15) {
      return res.status(400).json({ error: 'Nombre de usuario inválido' });
    }
    if (contrasena.length < 8 || contrasena.length > 20) {
      return res.status(400).json({ error: 'Contraseña inválida' });
    }


    const [existentes] = await db.query(
      'SELECT id FROM usuarios WHERE correo = ? OR nombre_usuario = ?',
      [correo, nombre_usuario]
    );
    if (existentes.length > 0) {
      return res
        .status(409)
        .json({ error: 'El correo o el nombre de usuario ya están registrados' });
    }


    const nombre_completo = '';
    const rfc = 'XAXX010101000';
    const regimen_fiscal = '601';

    const [result] = await db.query(
      `INSERT INTO usuarios
        (nombre_usuario, correo, contrasena, nombre_completo, rfc, regimen_fiscal)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre_usuario, correo, contrasena, nombre_completo, rfc, regimen_fiscal]
    );

    return res.status(201).json({
      ok: true,
      usuario: {
        id: result.insertId,
        nombre_usuario,
        correo,
      },
    });
  } catch (e) {
    console.error('❌ Error en registrarUsuario:', e);
    return res
      .status(500)
      .json({ error: e.message || 'Error interno al crear la cuenta' });
  }
};


export const loginUsuario = async (req, res) => {
  try {
    const { correo, nombre_usuario, contrasena } = req.body || {};

    if (!correo || !nombre_usuario || !contrasena) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    if (!isEmail(correo)) {
      return res.status(400).json({ error: 'Correo inválido' });
    }
    if (nombre_usuario.length < 1 || nombre_usuario.length > 15) {
      return res.status(400).json({ error: 'Nombre de usuario inválido' });
    }
    if (contrasena.length < 8 || contrasena.length > 20) {
      return res.status(400).json({ error: 'Contraseña inválida' });
    }

    const [rows] = await db.query(
      'SELECT id, nombre_usuario, correo, rol FROM usuarios WHERE correo = ? AND nombre_usuario = ? AND contrasena = ?',
      [correo, nombre_usuario, contrasena]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    return res.json({
      ok: true,
      usuario: rows[0],
    });
  } catch (e) {
    console.error('❌ Error en loginUsuario:', e);
    return res
      .status(500)
      .json({ error: e.message || 'Error interno al iniciar sesión' });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { correo } = req.body || {};

    if (!correo || !isEmail(correo)) {
      return res.status(400).json({ error: 'Correo inválido' });
    }

    const [rows] = await db.query(
      'SELECT id, nombre_usuario FROM usuarios WHERE correo = ?',
      [correo]
    );


    if (rows.length === 0) {
      return res.json({
        ok: true,
        message:
          'Si el correo existe, se generó un código de recuperación (demo).',
      });
    }

    const usuario = rows[0];

    const codigo = crypto.randomInt(100000, 999999).toString();
    const expira = new Date(Date.now() + 15 * 60 * 1000);

    await db.query(
      `UPDATE usuarios
       SET reset_codigo = ?, reset_expira = ?
       WHERE id = ?`,
      [codigo, expira, usuario.id]
    );

    const appUrl = process.env.FRONTEND_ORIGIN || 'http://localhost:4200';

    if (transporter) {

      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'no-reply@panaderia.com',
          to: correo,
          subject: 'Recuperación de contraseña - Panadería',
          text: `Hola ${usuario.nombre_usuario},

Tu código de recuperación es: ${codigo}
Válido por 15 minutos.

Ir a: ${appUrl}/forgot`,
        });
      } catch (mailErr) {
        console.error('❌ Error enviando correo de recuperación:', mailErr);
      }
    } else {

      console.log(
        `🔐 Código de recuperación para ${correo} (demo, sin SMTP): ${codigo}`
      );
    }

    return res.json({
      ok: true,
      message:
        'Si el correo existe, se generó un código de recuperación. Revisa tu correo o la consola del servidor.',
    });
  } catch (e) {
    console.error('❌ Error en forgotPassword:', e);
    return res
      .status(500)
      .json({ error: e.message || 'Error al solicitar recuperación' });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { correo, codigo, nuevaContrasena } = req.body || {};

    if (!correo || !isEmail(correo)) {
      return res.status(400).json({ error: 'Correo inválido' });
    }
    if (!codigo) {
      return res.status(400).json({ error: 'Debes enviar el código' });
    }
    if (
      !nuevaContrasena ||
      nuevaContrasena.length < 8 ||
      nuevaContrasena.length > 20
    ) {
      return res.status(400).json({ error: 'Contraseña inválida' });
    }

const [rows] = await db.query(
      'SELECT id, nombre_usuario, correo, rol FROM usuarios WHERE correo = ? AND nombre_usuario = ? AND contrasena = ?',
      [correo, nombre_usuario, contrasena]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    const user = rows[0];

    if (!user.reset_codigo || !user.reset_expira) {
      return res
        .status(400)
        .json({ error: 'No hay un código activo para este usuario' });
    }

    const expira = new Date(user.reset_expira);
    const ahora = new Date();

    if (user.reset_codigo !== codigo || expira < ahora) {
      return res.status(400).json({ error: 'Código inválido o expirado' });
    }

    await db.query(
      `UPDATE usuarios
       SET contrasena = ?, reset_codigo = NULL, reset_expira = NULL
       WHERE id = ?`,
      [nuevaContrasena, user.id]
    );

    return res.json({
      ok: true,
      message: 'Contraseña actualizada correctamente',
    });
  } catch (e) {
    console.error('❌ Error en resetPassword:', e);
    return res
      .status(500)
      .json({ error: e.message || 'Error al restablecer la contraseña' });
  }
};
