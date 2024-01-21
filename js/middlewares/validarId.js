module.exports = function validarId(req, res, next) {
    req.params.id = parseInt(req.params.id);
  
    if (isNaN(req.params.id)) {
      return res.status(400).json({ message: 'ID de película no válido' });
    }
  
    next();
  }