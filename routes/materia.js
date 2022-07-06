const express = require("express");
const router = express.Router();
const models = require("../models");
const autenticacion = require("../middlewares/autentication");

router.get("/", autenticacion, (req, res) => {
  const limit = req.query.limit;
  const offset = req.query.offset;
  models.materia
    .findAll({
      attributes: ["id", "nombre", "id_carrera"],
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null,
    })
    .then((materia) => res.send(materia))
    .catch((error) => res.status(500).send({ error }));
});

router.post("/", autenticacion, (req, res) => {
  models.materia
    .create({ nombre: req.body.nombre, id_carrera: req.body.id_carrera })
    .then((materia) => res.status(201).send({ id: materia.id }))
    .catch((error) => res.status(500).send({ error }));
});

router.get("/:id", autenticacion, (req, res) => {
  findMateria(req.params.id, {
    onSuccess: (materia) => res.send(materia),
    onNotFound: () =>
      res.status(404).send({ message: "No existe materia con ese ID." }),
    onError: (error) => res.status(500).send({ error }),
  });
});

router.put("/:id", autenticacion, (req, res) => {
  const onSuccess = (materia) => {
    materia
      .update({ nombre: req.body.nombre }, { fields: ["nombre"] })
      .then(() =>
        res.status(200).send({ message: "Materia actualizada exitosamente." }))
      .catch((error) => res.status(500).send({ error }));
  }
  findMateria(req.params.id, {
    onSuccess,
    onNotFound: () =>
      res.status(404).send({ message: "No existe materia con ese ID." }),
    onError: (error) => res.status(500).send({ error }),
  });
});

router.delete("/:id", autenticacion, (req, res) => {
  const onSuccess = (materia) => {
    materia
      .destroy()
      .then(() => res.status(200).send({ message: "Materia eliminada exitosamente."}))
      .catch((error) => res.status(500).send({ error }));
  }    
  findMateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.status(404).send({ message: "No existe materia con ese ID."}),
    onError: (error) => res.status(500).send({ error }),
  });
});

const findMateria = (id, { onSuccess, onNotFound, onError }) => {
  models.materia
    .findOne({
      attributes: ["id", "nombre", "id_carrera"],
      where: { id },
    })
    .then((materia) => (materia ? onSuccess(materia) : onNotFound()))
    .catch((error) => onError(error));
};

module.exports = router;
