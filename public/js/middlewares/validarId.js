module.exports = function validarId(req, res, next) {
  // console.log(req.body.id);
  id = req.params.id;
  id = parseInt(id);
  // console.log(req.body.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "ID de película no válido" });
  }

  next();
};
