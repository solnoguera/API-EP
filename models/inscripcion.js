("use strict");
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
    inscripcion.belongsTo(models.alumno, {
      as: "alumno-relacionado",
      foreignKey: "id_alumno",
    });

    inscripcion.belongsTo(models.materia, {
      as: "materia-relacionada",
      foreignKey: "id_materia",
    });
  };

  return inscripcion;
};
