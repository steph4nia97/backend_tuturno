const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  crearUsuario,
  buscarUsuarioPorCorreo,
} = require("../modelos/usuarioModelo");

const CLAVE_JWT = process.env.CLAVE_JWT;

// POST /api/auth/registro
async function registrarUsuario(req, res) {
  try {
    // aceptamos contraseña o contrasena
    const {
      nombre,
      correo,
      contraseña,
      contrasena,
      rol,
    } = req.body;

    const contraseñaPlano = contraseña || contrasena;

    if (!nombre || !correo || !contraseñaPlano || !rol) {
      return res.status(400).json({ mensaje: "Faltan datos" });
    }

    const usuarioExistente = await buscarUsuarioPorCorreo(correo);
    if (usuarioExistente) {
      return res
        .status(409)
        .json({ mensaje: "El correo ya está registrado" });
    }

    const contraseñaHash = await bcrypt.hash(contraseñaPlano, 10);

    const nuevoUsuario = await crearUsuario({
      nombre,
      correo,
      contraseñaHash,
      rol,
    });

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario: nuevoUsuario,
    });
  } catch (error) {
    console.error("Error en registrarUsuario:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

// POST /api/auth/login
async function iniciarSesion(req, res) {
  try {
    // aceptamos contraseña o contrasena
    const { correo, contraseña, contrasena } = req.body;
    const contraseñaPlano = contraseña || contrasena;

    if (!correo || !contraseñaPlano) {
      return res
        .status(400)
        .json({ mensaje: "Debes enviar correo y contraseña" });
    }

    const usuario = await buscarUsuarioPorCorreo(correo);
    if (!usuario) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const contraseñaCorrecta = await bcrypt.compare(
      contraseñaPlano,
      usuario.contraseña_hash
    );

    if (!contraseñaCorrecta) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    if (!CLAVE_JWT) {
      console.error("⚠️ CLAVE_JWT no está definida en el .env");
      return res.status(500).json({ mensaje: "Error de configuración JWT" });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol,
        nombre: usuario.nombre,
      },
      CLAVE_JWT,
      { expiresIn: "8h" }
    );

    res.json({
      mensaje: "Inicio de sesión exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en iniciarSesion:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

module.exports = {
  registrarUsuario,
  iniciarSesion,
};
