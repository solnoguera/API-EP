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
    .then((inscripcion) => res.status(200).send(inscripcion))
    .catch((error) => res.status(500).send({ error }));
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
    .then((inscripcion) => res.status(200).send({
        status: "Inscripción creada exitosamente",
        id: inscripcion.id,
      }))
    .catch((error) => res.status(500).send({
        message: `Error al intentar insertar en la base de datos: ${error}`,
      })
    );
});

router.get("/:id", autenticacion, (req, res) => {
  findInscripcion(req.params.id, {
    onSuccess: (inscripcion) => res.send(inscripcion),
    onNotFound: () => res.status(404).send({ message: "No existe una inscripcion con ese ID."}),
    onError: (error) => res.status(500).send({ error }),
  });
});

router.put("/:id", autenticacion, (req, res) => {
  const onSuccess = (inscripcion) => {
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
      .then(() => res
          .status(200)
          .send({ message: "Inscripcion actualizada exitosamente."}))
      .catch((error) => res
          .status(500)
          .send({ error }));
  }
  findInscripcion(req.params.id, {
    onSuccess,
    onNotFound: () => res.status(404).send({ message: "No existe una inscripcion con ese ID."}),
    onError: (error) => res.status(500).send({ error }),
  });
});

router.delete("/:id", autenticacion, (req, res) => {
  const onSuccess = (inscripcion) => {
    inscripcion
      .destroy()
      .then(() => res.status(200).send({ message: "Se ha eliminado la inscripción exitosamente." }))
      .catch((error) => res.status(500).send({ error }));
  }
  findInscripcion(req.params.id, {
    onSuccess,
    onNotFound: () => res.status(404).send({ message: "No existe una inscripción con ese ID." }),
    onError: (error) => res.status(500).send({ error }),
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
    .catch((error) => onError(error));
};

module.exports = router;
