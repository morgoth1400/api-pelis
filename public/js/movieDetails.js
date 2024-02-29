async function fetchMovieDetails() {
  const movieDetailsDiv = document.getElementById("movie-details");
  const movieId = movieDetailsDiv.getAttribute("data-movie-id");

  try {
    const response = await fetch(`/api/pelis/${movieId}`);

    if (!response.ok) {
      throw new Error("Error al obtener detalles de la película");
    }

    const movie = await response.json();

    // Rellenar la plantilla con los detalles de la película
    movieDetailsDiv.innerHTML = `
          <h2>${movie.title}</h2>
          <p><strong>Director:</strong> ${movie.director}</p>
          <p><strong>ID:</strong> ${movie.id}</p>
          <p>Synopsis: ${movie.synopsis}</p>
      `;
  } catch (error) {
    console.error("Error al obtener detalles de la película:", error);
    movieDetailsDiv.innerHTML = "Error al obtener detalles de la película";
  }
}

window.onload = fetchMovieDetails();
