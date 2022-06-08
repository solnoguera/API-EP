"use strict";
module.exports = (sequelize, DataTypes) => {
  const alumno = sequelize.define(
    "alumno",
    {
      nombre: DataTypes.STRING,
      apellido: DataTypes.STRING,
      email: DataTypes.STRING,
      dni: DataTypes.INTEGER,
      id_carrera: DataTypes.INTEGER,
    },
    {}
  );
  alumno.associate = function (models) {
    // associations can be defined here
    alumno.belongsTo(
      models.carrera, // modelo al que pertenece
      {
        as: "carrera-relacionada", // nombre de mi relacion
        foreignKey: "id_carrera", // campo con el que voy a igualar
      }
    );

    // alumno.belongsToMany(models.materia, { through: models.inscripcion });
  };
  return alumno;
};
