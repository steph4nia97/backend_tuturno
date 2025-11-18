const express = require("express");
const {
  obtenerTurnos,
  crearTurnoControlador,
} = require("../controladores/turnosControlador");
const { verificarToken } = require("../middlewares/authMiddleware");

const enrutador = express.Router();

// GET /api/turnos?fecha=2025-11-20
enrutador.get("/", verificarToken, obtenerTurnos);

// POST /api/turnos
enrutador.post("/", verificarToken, crearTurnoControlador);

module.exports = enrutador;
