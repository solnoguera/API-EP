"use strict";
module.exports = (sequelize, DataTypes) => {
  const usuario = sequelize.define(
    "usuario",
    {
      nombre: DataTypes.STRING,
      email: DataTypes.STRING,
      contrasenia: DataTypes.STRING,
      jwt: DataTypes.STRING,
    },
    {}
  );

  return usuario;
};
