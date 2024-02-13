<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<div id="movie-details">
        <!-- Aquí se llenarán los detalles de la película -->
    </div>
<script>
// Función para obtener detalles de la película por su ID
async function fetchMovieDetails() {
    // Obtener el ID de la película de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    console.log(movieId);
    // Hacer una solicitud a la API para obtener detalles de la película por su ID
    const response = await fetch(`/api/pelis/${movieId}`);
    const movie = await response.json();

    // Rellenar la plantilla con los detalles de la película
    const movieDetailsDiv = document.getElementById('movie-details');
    movieDetailsDiv.innerHTML = `
        <h2>${movie.title}</h2>
        <p><strong>Director:</strong> ${movie.director}</p>
        <p><strong>ID:</strong> ${movie.id}</p>
    `;
}

// Llamar a la función para obtener detalles de la película al cargar la página
fetchMovieDetails();
</script>

</body>
</html>