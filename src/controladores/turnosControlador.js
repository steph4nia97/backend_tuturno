const {
  crearTurno,
  obtenerTurnosPorFecha,
  obtenerTurnosPorRango,
} = require("../modelos/turnoModelo");

async function obtenerTurnos(req, res) {
  try {
    const { fecha, desde, hasta } = req.query;

    if (desde && hasta) {
      const listaTurnos = await obtenerTurnosPorRango(desde, hasta);
      return res.json(listaTurnos);
    }

    if (!fecha) {
      return res.status(400).json({
        mensaje: "Debes enviar fecha=YYYY-MM-DD o desde y hasta",
      });
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

    // Si no envían id_trabajador, usa el usuario autenticado
    const idTrabajador = id_trabajador || req.usuario?.id;

    if (!idTrabajador || !fecha || !hora_inicio || !hora_fin) {
      return res.status(400).json({ mensaje: "Faltan datos del turno" });
    }

    const nuevoTurno = await crearTurno({
      idTrabajador,
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
