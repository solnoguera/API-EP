const express = require("express");
const router = express.Router();
const models = require("../models");
const autenticacion = require("../middlewares/autentication");

router.get("/", autenticacion, (req, res) => {
  const limit = req.query.limit;
  const offset = req.query.offset;
  models.inscripcion
    .findAll({
      attributes: [
        "id",
        "id_alumno",
        "id_materia",
        "comision",
        "profesor",
        "fechaInscripcion",
      ],
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null,
      include: [
        {
          as: "alumno-relacionado",
          model: models.alumno,
          attributes: [
            "id",
            "dni",
            "nombre",
            "apellido",
            "email",
            "id_carrera",
          ],
        },
        {
          as: "materia-relacionada",
          model: models.materia,
          attributes: ["id", "nombre", "id_carrera"],
        },
      ],
    })
    .then((inscripcion) => {
      return res.send(inscripcion);
    })
    .catch((error) => res.sendStatus(500).send({ error }));
});

router.post("/", autenticacion, (req, res) => {
  models.inscripcion
    .create({
      id_alumno: req.body.id_alumno,
      id_materia: req.body.id_materia,
      comision: req.body.comision,
      profesor: req.body.profesor,
      fechaInscripcion: req.body.fechaInscripcion,
    })
    .then((inscripcion) => {
      res.statusCode = 201;
      res.send({
        status: "Inscripcion creada exitosamente",
        id: inscripcion.id,
      });
    })
    .catch((error) => {
      res.statusCode = 500;
      res.send({
        msg: `Error al intentar insertar en la base de datos: ${error}`,
      });
    });
});

const findInscripcion = (id, { onSuccess, onNotFound, onError }) => {
  models.inscripcion
    .findOne({
      attributes: [
        "id",
        "id_alumno",
        "id_materia",
        "comision",
        "profesor",
        "fechaInscripcion",
      ],
      where: { id },
    })
    .then((inscripcion) =>
      inscripcion ? onSuccess(inscripcion) : onNotFound()
    )
    .catch(() => onError());
};

router.get("/:id", autenticacion, (req, res) => {
  findInscripcion(req.params.id, {
    onSuccess: (inscripcion) => res.send(inscripcion),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.put("/:id", autenticacion, (req, res) => {
  const onSuccess = (inscripcion) =>
    inscripcion
      .update(
        {
          id_alumno: req.body.id_alumno,
          id_materia: req.body.id_materia,
          comision: req.body.comision,
          profesor: req.body.profesor,
          fechaInscripcion: req.body.fechaInscripcion,
        },
        {
          fields: [
            "id_alumno",
            "id_materia",
            "comision",
            "profesor",
            "fechaInscripcion",
          ],
        }
      )
      .then(() => {
        res
          .send({ status: "inscripcion actualizado exitosamente" })
          .sendStatus(200);
      })
      .catch((error) => {
        res
          .sendStatus(500)
          .send(`Error al intentar actualizar la base de datos: ${error}`);
      });
  findInscripcion(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.delete("/:id", autenticacion, (req, res) => {
  const onSuccess = (inscripcion) =>
    inscripcion
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findInscripcion(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

module.exports = router;
