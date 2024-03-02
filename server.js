const express = require("express"),
  session = require("express-session"),
  mysql = require("mysql2"),
  bodyParser = require("body-parser"),
  path = require("path"),
  validarId = require("./public/js/middlewares/validarId");

const app = express();
const PORT = 1972;

//Localización y motor de plantillas EJS
app.set("views", "./views");
app.set("view engine", "ejs");

//esto en principio no hace falta mientras no utilice  php
// app.engine('php', phpExpress.engine);
// app.all(/.+\.php$/, phpExpress.router);

// Habilita el envío de variables mediante POST y GET en la URL
app.use(bodyParser.urlencoded({ extended: true }));
// Habilita el uso de JSON, no viene integrado con Express por defecto
app.use(bodyParser.json());
// La carpeta de archivos estáticos públicos
app.use(express.static(path.join(__dirname, "/public")));

app.use(
  session({
    secret: "2144-4D32-Wpasd38S-249sffgs-1257412s-d234FgFH",
    resave: false,
    saveUninitialized: false,
  })
);

// Authentication and Authorization Middleware FOR ADMIN
var adminAuth = function (req, res, next) {
  // if (req.session && req.session.user == "dani" && req.session.admin)
  if (req.session && req.session.admin) return next();
  else return res.sendStatus(401);
}; ///////////////////////////////////////

// Middleware para verificar si hay una sesión activa
const checkSession = (req, res, next) => {
  /*La razón por la que loggedIn se establece en res.locals 
  es porque esto permite que esté disponible en todas las vistas 
  que se renderizan en esa solicitud.
  Ahora, respecto a por qué se reconoce en la plantilla sin ejecutar 
  explícitamente la función, esto se debe a cómo funcionan los motores
  de plantillas en Express. Cuando renderizas una plantilla, el motor 
  de plantillas automáticamente incluye todas las variables disponibles
  en res.locals como variables en la plantilla. Esto significa que cualquier 
  variable que pongas en res.locals estará disponible directamente en
  tu plantilla sin necesidad de pasarla explícitamente a través del 
  contexto de renderizado.*/
  res.locals.loggedIn = req.session.user ? true : false;
  next();
};

app.use(checkSession);

// Conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "daniel",
  password: "Juande123",
  database: "moviesDB",
});

connection.connect((err) => {
  if (err) {
    console.error("Error de conexión a la base de datos:", err);
  } else {
    console.log("Conexión exitosa a la base de datos MySQL");
  }
});

////*****  Rutas de la API *****////

/* RUTAS DE SESIÓN */
/////////////////////////////////////////PROBAR LO ÚLTIMO QUE COMENTA CHATGPT RESPECTO A LAS RESPUESTAS
function checkUser(username, password) {
  return new Promise((resolve, reject) => {
    const sqlquery = "SELECT pass FROM users WHERE username = ?";
    connection.query(sqlquery, username, (error, results) => {
      if (error) {
        reject(error);
      } else if (results.length === 0) {
        resolve(false);
      } else {
        //
        const dbPassword = results[0].pass;
        resolve(password === dbPassword);
      }
    });
  });
}

app.post("/login", async function (req, res) {
  console.log(req.body.username);
  console.log(req.body.password);

  if (!req.body.username || !req.body.password) {
    res.send("Usuario o contraseña inválido");
    // console.log("Usuario o contraseña inválido");
  } else {
    try {
      const isValidUser = await checkUser(req.body.username, req.body.password);
      if (isValidUser) {
        req.session.user = req.body.username;
        // req.session.admin = true;
        //TODO: hacer la lógica para verificar si tiene rol de admin
        // res.send("Login success!");
        res.redirect("/index");
      } else {
        res.send("Usuario o contraseña incorrecta");
        // console.log("Usuario o contraseña incorrecta");
      }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).send("Error during login");
    }
  }
});

app.get("/logout", function (req, res) {
  req.session.destroy();
  // res.send("Logout success!");
  res.redirect("/index");
});

/* RUTAS WEB O PÚBLICAS*/
//Redirigir al index
app.get("/", (req, res) => {
  res.redirect("/index");
});

//Ocultar extensión index
app.get("/index", (req, res) => {
  res.render(path.join(__dirname, "views", "index.ejs"));
});

app.get("/loginForm", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/userProfile", (req, res) => {
  res.render(path.join(__dirname, "views", "userProfile.ejs"));
});

/*ESTA ES LA FORMA PARA ENVIAR VARIABLES POST AL SERVIDOR 
Y REUTILIZARLAS EN UN ARCHIVO EJS(PLANTILLA JS DE HTML PARA RELLENAR CON DATOS)*/
app.post("/movie", (req, res) => {
  const movieId = req.body.movieId;
  res.render("movieTemplate", { movieId: movieId });
});

// Get content endpoint ////////////////////
app.get("/adminContent", adminAuth, function (req, res) {
  res.send("You can only see this after you've logged in AS ADMIN.");
}); ///////////////////////////////////////

app.get("/content", checkSession, function (req, res) {
  res.send("You can only see this after you've logged in.");
}); ///////////////////////////////////////

/* RUTAS JS */
//cambiar estos nombres de las URL para que no sean directamente los mismos que los de los archivos js
app.get("/displayMovies", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "js", "displayMovies.js"));
});

app.get("/movieDetails", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "js", "movieDetails.js"));
});

app.get("/userDetails", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "js", "userDetails.js"));
});

/* RUTAS BD */
app.get("/api/movies", (req, res) => {
  connection.query("SELECT * FROM movies", (error, results) => {
    if (error) {
      res.json({ message: error.message });
    } else {
      res.json(results);
    }
  });
});

// Seleccionando una película de la lista
// validarId = Middleware para validar el ID
app.get("/api/pelis/:id", validarId, (req, res) => {
  /*Para pasarle el id mediante la ruta sería así:
      /api/movies/:id
      (En la llamada los dos puntos se omiten => /api/movies/1)
      El id se recoge como parámetro de la request*/
  const sqlquery = "SELECT * FROM movies WHERE id = ?";
  connection.query(sqlquery, parseInt(req.params.id), (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: "Película no encontrada" });
    } else {
      res.json(results[0]);
      /*
        La función 'connection.query' devuelve un arreglo y cada elemento es una fila en la tabla
        incluso cuando se devuelve una sola columna
        */
    }
  });
});

app.get("/username", (req, res) => {
  const user = req.session.user;
  res.json({ user: user });
});

app.get("/userInfo/:user", (req, res) => {
  const sqlquery = "SELECT * FROM users WHERE username = ?";
  connection.query(sqlquery, req.params.user, (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: "Usuario no encontrado." });
    } else {
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

//modificar película

// Iniciar el servidor
app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});
