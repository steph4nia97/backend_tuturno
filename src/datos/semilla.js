require("dotenv").config();
const bcrypt = require("bcryptjs");
require("../config/basedatos");
const {
  crearUsuario,
  buscarUsuarioPorCorreo,
} = require("../modelos/usuarioModelo");

async function sembrar() {
  const correo = "trabajador@tuturno.local";
  const existente = await buscarUsuarioPorCorreo(correo);

  if (existente) {
    console.log("Usuario demo ya existe:", correo);
    process.exit(0);
  }

  const contraseñaHash = await bcrypt.hash("Trabajo123!", 10);
  const usuario = await crearUsuario({
    nombre: "Trabajador Demo",
    correo,
    contraseñaHash,
    rol: "trabajador",
  });

  console.log("Usuario demo creado:");
  console.log("  correo:", correo);
  console.log("  contraseña: Trabajo123!");
  console.log("  id:", usuario.id);
  process.exit(0);
}

sembrar().catch((error) => {
  console.error(error);
  process.exit(1);
});
