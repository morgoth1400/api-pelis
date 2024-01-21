const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const validarId = require('./middlewares/validarId');

const app = express();
const PORT = 1972;
//const PORT = process.env.PORT || 1972;

// Habilita el uso de JSON, no viene integrado con Express por defecto
app.use(bodyParser.json());

// Conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'daniel',
  password: 'Juande123',
  database: 'moviesDB',
});

connection.connect(err => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos MySQL');
  }
});

/* Rutas de la API */

// Obtener listado de todas las películas
app.get('/api/movies', (req, res) => {
  connection.query('SELECT * FROM movies', (error, results) => {
    if (error) {
      res.json({ message: error.message });
    } else {
      res.json(results);
    }
  });
});

// Obtener perfil de una película
// validarId = Middleware para validar el ID
app.get('/api/movie-profile/:id', validarId, (req, res) => {
  connection.query('SELECT * FROM movies WHERE id ='+req.params.id, (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Película no encontrada' });
    } else {
      res.json(results);
    }
  });
});

// Añadir una nueva película
/*app.post('/api/movies', (req, res) => {
  const { title, director, year } = req.body;
  const query = 'INSERT INTO movies (title, director, year) VALUES (?, ?, ?)';
  connection.query(query, [title, director, year], (error, results) => {
    if (error) {
      res.json({ message: error.message });
    } else {
      res.json({ id: results.insertId, title, director, year });
    }
  });
});
*/
app.use(express.static('public'));

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});