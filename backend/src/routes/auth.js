const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro';

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email y contraseña requeridos' });
  }
  try {
    const result = await pool.query('SELECT * FROM usuario WHERE email = $1 AND activo = true', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }
    const usuario = result.rows[0];
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }
    // No incluir password en el token
    const { password: _, ...usuarioSinPassword } = usuario;
    const token = jwt.sign(usuarioSinPassword, JWT_SECRET, { expiresIn: '8h' });
    res.json({ success: true, token, usuario: usuarioSinPassword });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Registro (opcional)
router.post('/register', async (req, res) => {
  const { nombre, apellido, email, password, id_rol } = req.body;
  if (!nombre || !apellido || !email || !password || !id_rol) {
    return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO usuario (nombre, apellido, email, password, id_rol, activo, fecha_creacion) VALUES ($1, $2, $3, $4, $5, true, NOW()) RETURNING id, nombre, apellido, email, id_rol, activo, fecha_creacion',
      [nombre, apellido, email, hash, id_rol]
    );
    res.json({ success: true, usuario: result.rows[0] });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

module.exports = router;
