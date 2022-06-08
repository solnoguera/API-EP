let alumno = require("./alumno");
let materia = require("./materia")("use strict");
module.exports = (sequelize, DataTypes) => {
  const inscripcion = sequelize.define(
    "inscripcion",
    {
      id_alumno: DataTypes.INTEGER,
      id_materia: DataTypes.INTEGER,
      comision: DataTypes.INTEGER,
      profesor: DataTypes.STRING,
      fechaInscripcion: DataTypes.DATE,
    },
    {}
  );

  inscripcion.associate = function (models) {
    /* associations */
    inscripcion.belongsTo(models.alumno, {
      as: "alumno-relacionado",
      foreignKey: "id",
    });

    inscripcion.belongsTo(models.materia, {
      as: "materia-relacionada",
      foreignKey: "id",
    });
  };

  return inscripcion;
};