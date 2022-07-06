const express = require("express");
const router = express.Router();
const models = require("../models");
const authServices = require("../services/authService");
const adminAuth = require("../middlewares/adminAuth")

router.post("/registrar", adminAuth, (req, res) => {
  const token = authServices.generarJwt(req.body.email);
  const existeElUsuario = findUsuario(req.body.email);

  existeElUsuario
    .then((usuario) => {
      if (usuario) {
        res.send({
          mensaje: "Ya está registrado ese email en el sistema.",
        });
      } else {
        models.usuario
          .create({
            nombre: req.body.nombre,
            email: req.body.email,
            contrasenia: authServices.encriptarClave(req.body.contraseña),
            jwt: token,
          })
          .then(() =>
            res.status(201).send({
              mensaje: "Usuario creado con éxito",
              token,
            })
          )
          .catch((error) => res.status(500).send({ error }));
      }
    })
    .catch(() => res.sendStatus(500));
});

router.post("/login", async (req, res) => {
  try {
    const usuario = await models.usuario.findOne({
      attributes: ["jwt", "contrasenia"],
      where: {
        email: req.body.email,
      },
    });
    if (usuario) {
      const claveCorrecta = authServices.compararClaves(
        req.body.contraseña,
        usuario.dataValues.contrasenia
      );
      claveCorrecta
        ? res.send({ token: usuario.dataValues.jwt })
        : res.status(400).send({ mensaje: "Clave Incorrecta" });
    } else {
      res.send({ mensaje: "El email no está registrado." });
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error,
    });
  }
});

router.get("/", adminAuth, async (req, res) => {
  const limit = req.query.limit;
  const offset = req.query.offset;
  models.usuario
    .findAll({
      attributes: ["nombre", "email", "contrasenia", "jwt"],
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null,
    })
    .then((usuarios) => res.status(200).send(usuarios))
    .catch((error) => res.status(500).send({ error }));
});

const findUsuario = (email) => {
  return models.usuario.findOne({
    attributes: ["nombre", "email", "contrasenia", "jwt"],
    where: { email },
  });
};

module.exports = router;
