const express = require("express");
const router = express.Router();
const models = require("../models");
const autenticacion = require("../middlewares/autentication");

router.get("/", autenticacion, (req, res) => {
  const limit = req.query.limit;
  const offset = req.query.offset;
  models.alumno
    .findAll({
      attributes: ["id", "dni", "nombre", "apellido", "email", "id_carrera"],
      include: [
        {
          as: "carrera-relacionada",
          model: models.carrera,
          attributes: ["nombre"],
        },
      ],
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null,
    })
    .then((alumno) => res.send(alumno))
    .catch((error) => {
      res.sendStatus(500).send({ error });
    });
});

router.post("/", autenticacion, (req, res) => {
  models.alumno
    .create({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      email: req.body.email,
      dni: req.body.dni,
      id_carrera: req.body.id_carrera,
    })
    .then((alumno) =>
      res
        .status(201)
        .send({ status: "Alumno creado exitosamente", id: alumno.id })
    )
    .catch((error) => {
      res
        .sendStatus(500)
        .send(`Error al intentar insertar en la base de datos: ${error}`);
    });
});

const findAlumno = (id, { onSuccess, onNotFound, onError }) => {
  models.alumno
    .findOne({
      attributes: ["id", "dni", "nombre", "apellido", "email", "id_carrera"],
      where: { id },
    })
    .then((alumno) => (alumno ? onSuccess(alumno) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", autenticacion, (req, res) => {
  findAlumno(req.params.id, {
    onSuccess: (alumno) => res.send(alumno),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.put("/:id", autenticacion, (req, res) => {
  const onSuccess = (alumno) =>
    alumno
      .update(
        {
          nombre: req.body.nombre,
          apellido: req.body.apellido,
          email: req.body.email,
          dni: req.body.dni,
          id_carrera: req.body.id_carrera,
        },
        {
          fields: ["dni", "nombre", "apellido", "email", "id_carrera"],
        }
      )
      .then(() => {
        res.send({ status: "Alumno actualizado exitosamente" }).sendStatus(200);
      })
      .catch((error) => {
        res
          .sendStatus(500)
          .send(`Error al intentar actualizar la base de datos: ${error}`);
      });
  findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.delete("/:id", autenticacion, (req, res) => {
  const onSuccess = (alumno) =>
    alumno
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

module.exports = router;
