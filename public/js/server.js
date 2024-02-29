const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
//Por algún motivo no coge 'php' como comando aunque esté en el path
//lo que obliga a poner la ruta completa
const phpExpress = require('php-express')({ binPath: '"C:\\Program Files\\php-8.3.2\\php.exe"' });
const path = require('path');
const validarId = require('./middlewares/validarId');

const app = express();
const PORT = 1972;
//const PORT = process.env.PORT || 1972;

app.set('views', '../../views/php');
app.engine('php', phpExpress.engine);
app.set('view engine', 'ejs');

app.all(/.+\.php$/, phpExpress.router);

app.use(bodyParser.urlencoded({ extended: true }));
// Habilita el uso de JSON, no viene integrado con Express por defecto
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../')));

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

//Redirigir al index
app.get('/', (req, res) => {
  res.redirect('index.php');
});



app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/php', 'login.php'));
});

//hace falta esto?
app.get('/movie-template.php', (req, res) => {
  res.redirect('movie-template.php');
});

app.post('/movie', (req, res) => {
  const movieId = req.body.movieId;
  // render your play.ejs file which is located in views
  // /views/play.ejs
  // second parameter is an object that will be accessible in your view
  res.render('movie-template', { movieId: movieId });

});

app.get('/fetchAndDisplayMovies', (req, res) => {
  res.sendFile(path.join(__dirname, 'fetchAndDisplayMovies.js'));
});

app.get('/movieDetails', (req, res) => {
  res.sendFile(path.join(__dirname, 'movieDetails.js'));
});


app.get('/api/movies', (req,res) => {
    connection.query('SELECT * FROM movies', (error, results) => {
      if (error) {
        res.json({ message: error.message });
      } else {
        res.json(results);
      }
    });
  });

  // Seleccionando una película de la lista
  // validarId = Middleware para validar el ID
  
app.get('/api/pelis/:id', validarId, (req, res) => {
    /*Para pasarle el id mediante la ruta sería así:
      /api/movies/:id
      (En la llamada los dos puntos se omiten => /api/movies/1)
      El id se recoge como parámetro de la request:
      connection.query(sqlquery, [req.params.id], (error, results) => {*/
    const sqlquery = "SELECT * FROM movies WHERE id = ?"
    connection.query(sqlquery, parseInt(req.params.id), (error, results) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else if (results.length === 0) {
        res.status(404).json({ message: 'Película no encontrada' });
      } else {
        /*La función 'connection.query' devuelve un arreglo y cada elemento es una fila en la tabla
        Se devuelve un arreglo incluso cuando se devuelve una sola columna, por lo que para devolver
        solamente la información de una película tenemos que acceder al primer elemento del arreglo.
        */
        res.json(results[0]);
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

// Iniciar el servidor
app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});