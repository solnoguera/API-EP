'use strict';
module.exports = (sequelize, DataTypes) => {
  const usuario = sequelize.define('usuario', {
    nombre: DataTypes.STRING,
    email: DataTypes.STRING,
    contrasenia: DataTypes.STRING,
    jwt: DataTypes.STRING
  }, {});
  usuario.associate = function(models) {
    // associations can be defined here
  };
  return usuario;
};