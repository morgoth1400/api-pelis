async function displayMovies() {
  const movieListElement = document.getElementById("movieList");

  try {
    const response = await fetch("http://localhost:1972/api/movies");
    if (!response.ok) {
      throw new Error("Error al obtener detalles de la película");
    }
    const moviesData = await response.json();

    const ulElement = document.createElement("ul");

    moviesData.forEach((movie) => {
      const liElement = document.createElement("li");
      const linkElement = document.createElement("a");
      linkElement.href = "#";
      linkElement.innerHTML = `${movie.title}  (${movie.year}) - Dirigida por ${movie.director}`;

      /////////////////////////////////////////////////////////////
      const formElement = document.createElement("form");
      formElement.method = "POST";
      formElement.action = "/movie"; // Reemplaza 'tu_ruta_del_servidor' con la URL de tu servidor
      // Crear input oculto para enviar el id
      const idInputElement = document.createElement("input");
      idInputElement.type = "hidden";
      idInputElement.name = "movieId";
      idInputElement.value = movie.id;

      linkElement.addEventListener("click", function (event) {
        event.preventDefault(); // Evitar la acción predeterminada del enlace (navegar a la URL)
        formElement.submit(); // Enviar el formulario
      });
      // Agregar el input al formulario
      formElement.appendChild(idInputElement);

      // Agregar el formulario al enlace
      linkElement.appendChild(formElement);
      /////////////////////////////////////////////////////////////

      liElement.appendChild(linkElement);
      ulElement.appendChild(liElement);
    });

    movieListElement.appendChild(ulElement);
  } catch (error) {
    console.error("Error al obtener datos de la API:", error);
    movieListElement.textContent = "Error al obtener datos de la API: " + error;
  }
}

window.onload = displayMovies;
