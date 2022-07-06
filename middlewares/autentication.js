const authServices = require("../services/authService");

const autenticacion = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({
      message:
        "Te falta el header Authorization con: Bearer + token proporcionado.",
    });
  }
  const token = req.headers.authorization.split(" ")[1];
  try {
    const userEmail = await authServices.verificarJwt(token);
    console.log({ userEmail });
    const user = await authServices.getByEmail(userEmail);
    if (!user) {
      return res.status(401).send({ message: "No tenes autorización" });
    }
    req.user = user?.dataValues;

    next();
  } catch {
    res.status(401).send({
      message: "El token proporcionado es inválido.",
    });
  }
};

module.exports = autenticacion;
