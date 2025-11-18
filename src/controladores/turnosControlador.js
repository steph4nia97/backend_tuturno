const {
  crearTurno,
  obtenerTurnosPorFecha,
} = require("../modelos/turnoModelo");

async function obtenerTurnos(req, res) {
  try {
    const { fecha } = req.query;

    if (!fecha) {
      return res
        .status(400)
        .json({ mensaje: "Debes enviar una fecha (YYYY-MM-DD)" });
    }

    const listaTurnos = await obtenerTurnosPorFecha(fecha);
    res.json(listaTurnos);
  } catch (error) {
    console.error("Error en obtenerTurnos:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

async function crearTurnoControlador(req, res) {
  try {
    const { id_trabajador, fecha, hora_inicio, hora_fin } = req.body;

    if (!id_trabajador || !fecha || !hora_inicio || !hora_fin) {
      return res.status(400).json({ mensaje: "Faltan datos del turno" });
    }

    const nuevoTurno = await crearTurno({
      idTrabajador: id_trabajador,
      fecha,
      horaInicio: hora_inicio,
      horaFin: hora_fin,
    });

    res.status(201).json(nuevoTurno);
  } catch (error) {
    console.error("Error en crearTurnoControlador:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

module.exports = {
  obtenerTurnos,
  crearTurnoControlador,
};
