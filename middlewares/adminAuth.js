require("dotenv").config();

const adminAuth = (req, res, next) => {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if(!req.headers.adminpassword){
        return res.status(401).send({
            message:
              "Te falta el Header AdminPassword.",
          });
    }
    if (req.headers.adminpassword !== adminPassword) {
      return res.status(401).send({
        message:
          "El AdminPassword proporcionado es incorrecto.",
      });
    }
    next();
}

module.exports = adminAuth;