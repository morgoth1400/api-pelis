const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 1972;

app.use(bodyParser.json());

// Conectar a la base de datos MySQL
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


// Rutas de la API

// Obtener todas las películas
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
app.get('/api/movie-profile', (req, res) => {
  connection.query('SELECT * FROM movies', (error, results) => {
    if (error) {
      res.json({ message: error.message });
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

/*
TO-DO LIST:
-WEBSCRAPEAR INFO DE LAS PELÍCULAS?
*/