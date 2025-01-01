const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const USER = mongoose.model("USER");

const jwtsecret = "adhikowshikkowshikadhi";

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in." });
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, jwtsecret, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "You must be logged in." });
    }
    const { _id } = payload;
    USER.findById(_id)
      .then((userdata) => {
        req.user = userdata;
        next();
      })
      .catch((err) => {
        res.status(401).json({ error: "You must be logged in." });
      });
  });
};
