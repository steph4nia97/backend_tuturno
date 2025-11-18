require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/basedatos");

const rutasAutenticacion = require("./rutas/autenticacionRutas");
const rutasTurnos = require("./rutas/turnosRutas");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend TuTurno funcionando ✅");
});

app.use("/api/auth", rutasAutenticacion);
app.use("/api/turnos", rutasTurnos);

const PUERTO = process.env.PUERTO || 4000;

app.listen(PUERTO, () => {
  console.log("Servidor TuTurno escuchando en el puerto", PUERTO);
});
