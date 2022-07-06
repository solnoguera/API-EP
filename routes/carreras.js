const express = require("express");
const router = express.Router();
const models = require("../models");
const autenticacion = require("../middlewares/autentication");

router.get("/", autenticacion, (req, res) => {
  const limit = req.query.limit;
  const offset = req.query.offset;
  models.carrera
    .findAll({
      attributes: ["id", "nombre"],
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null,
    })
    .then((carreras) => res.send(carreras))
    .catch((error) => res.status(500).send({ error }));
});

router.post("/", autenticacion, (req, res) => {
  models.carrera
    .create({ nombre: req.body.nombre })
    .then((carrera) => res.status(201).send({ id: carrera.id }))
    .catch((error) => res.status(500).send({ error }));
});

router.get("/:id", autenticacion, (req, res) => {
  findCarrera(req.params.id, {
    onSuccess: (carrera) => res.send(carrera),
    onNotFound: () => res.status(404).send({ message: "No existe una carrera con ese ID."}),
    onError: (error) => res.status(500).send({ error }),
  });
});

router.put("/:id", autenticacion, (req, res) => {
  const onSuccess = (carrera) => {
    carrera
      .update({ nombre: req.body.nombre }, { fields: ["nombre"] })
      .then(() => res.status(200).send({ message: "Se ha actualizado la carrera exitosamente."}))
      .catch((error) => res.status(500).send({ error }));
  }
  findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.status(404).send({ message: "No existe una carrera con ese ID." }),
    onError: (error) => res.status(500).send({ error }),
  });
});

router.delete("/:id", autenticacion, (req, res) => {
  const onSuccess = (carrera) => {
    carrera
      .destroy()
      .then(() => res.status(200).send({ message: "Se ha eliminado la carrera exitosamente." }))
      .catch((error) => res.status(500).send({ error }));
  }   
  findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.status(404).send({ message: "No existe una carrera con ese ID." }),
    onError: (error) => res.status(500).send({ error }),
  });
});

const findCarrera = (id, { onSuccess, onNotFound, onError }) => {
  models.carrera
    .findOne({
      attributes: ["id", "nombre"],
      where: { id },
    })
    .then((carrera) => (carrera ? onSuccess(carrera) : onNotFound()))
    .catch((error) => onError(error));
};

module.exports = router;
