const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRET_KEY = "secretKey";
const models = require("../models");

const generarJwt = (data) => {
  console.log("HOLA");
  return jwt.sign(data, SECRET_KEY);
};

const verificarJwt = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

const encriptarClave = (clave) => {
  return bcrypt.hashSync(clave, 10);
};

const compararClaves = (clave, claveEncriptada) => {
  return bcrypt.compareSync(clave, claveEncriptada);
};

const getById = async (id) => {
  try {
    const usuario = await models.usuario.findOne({
      attributes: ["id", "nombre", "rol"],
      where: {
        id,
      },
    });
    return usuario;
  } catch (error) {
    console.log(error);
  }
};

const authServices = {
  generarJwt,
  verificarJwt,
  encriptarClave,
  compararClaves,
  getById,
};
module.exports = authServices;
