const bd = require("../config/basedatos");

function crearTurno({ idTrabajador, fecha, horaInicio, horaFin }) {
  return new Promise((resolver, rechazar) => {
    const sql = `
      INSERT INTO turnos (id_trabajador, fecha, hora_inicio, hora_fin)
      VALUES (?, ?, ?, ?)
    `;
    bd.run(
      sql,
      [idTrabajador, fecha, horaInicio, horaFin],
      function (error) {
        if (error) return rechazar(error);
        resolver({
          id: this.lastID,
          idTrabajador,
          fecha,
          horaInicio,
          horaFin,
        });
      }
    );
  });
}

function obtenerTurnosPorFecha(fecha) {
  return new Promise((resolver, rechazar) => {
    const sql = `
      SELECT t.id,
             t.fecha,
             t.hora_inicio,
             t.hora_fin,
             u.id     AS id_trabajador,
             u.nombre AS nombre_trabajador
      FROM turnos t
      JOIN usuarios u ON u.id = t.id_trabajador
      WHERE t.fecha = ?
      ORDER BY t.hora_inicio
    `;
    bd.all(sql, [fecha], (error, filas) => {
      if (error) return rechazar(error);
      resolver(filas);
    });
  });
}

module.exports = {
  crearTurno,
  obtenerTurnosPorFecha,
};
