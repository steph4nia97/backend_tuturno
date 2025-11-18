const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Ruta donde se creará el archivo de la base de datos
const rutaBD = path.join(__dirname, "../../tuturno.db");

const bd = new sqlite3.Database(rutaBD, (error) => {
  if (error) {
    console.error("Error conectando a SQLite:", error.message);
  } else {
    console.log("Conectado a SQLite:", rutaBD);
  }
});

// Crear tablas si no existen
bd.serialize(() => {
  bd.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      correo TEXT UNIQUE NOT NULL,
      contraseña_hash TEXT NOT NULL,
      rol TEXT NOT NULL CHECK (rol IN ('trabajador', 'admin'))
    )
  `);

  bd.run(`
    CREATE TABLE IF NOT EXISTS turnos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_trabajador INTEGER NOT NULL,
      fecha TEXT NOT NULL,
      hora_inicio TEXT NOT NULL,
      hora_fin TEXT NOT NULL,
      FOREIGN KEY (id_trabajador) REFERENCES usuarios(id)
    )
  `);
});

module.exports = bd;
