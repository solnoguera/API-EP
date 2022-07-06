require("dotenv").config();
const express = require("express");
const router = express.Router();
const models = require("../models");
const authServices = require("../services/authService");

router.post("/registrar", (req, res) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (req.headers.adminpassword !== adminPassword) {
    return res.status(401).send({
      message:
        "Te falta el header AdminPassword o la contraseña proporcionada es incorrecta.",
    });
  }
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
          .catch((error) => {
            if (error == "SequelizeUniqueConstraintError: Validation error") {
              res
                .status(400)
                .send("Bad request: existe otra usuario con el mismo nombre");
            } else {
              console.log(
                `Error al intentar insertar en la base de datos: ${error}`
              );
              res.sendStatus(500);
            }
          });
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
    console.log({ usuario });
    if (usuario) {
      const claveCorrecta = authServices.compararClaves(
        req.body.contraseña,
        usuario.dataValues.contrasenia
      );
      console.log({ claveCorrecta });
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

// router.get("/", async (req, res) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     const id = authServices.verificarJwt(token);
//     const usuario = await models.usuario.findOne({
//       attributes: ["id", "nombre"],
//       where: {
//         id,
//       },
//     });
//     res.json(usuario);
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: error,
//     });
//   }
// });

const findUsuario = (email) => {
  return models.usuario.findOne({
    attributes: ["nombre", "email", "contrasenia", "jwt"],
    where: { email },
  });
};

module.exports = router;
