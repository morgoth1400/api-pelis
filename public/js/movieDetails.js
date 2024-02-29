async function fetchMovieDetails() {
    const movieDetailsDiv = document.getElementById('movie-details');
    
    const movieId = movieDetailsDiv.getAttribute('data-movie-id');
    // Hacer una solicitud a la API para obtener detalles de la película por su ID
    try {
      const response = await fetch(`/api/pelis/${movieId}`);
      if (!response.ok) {
        throw new Error('Error al obtener detalles de la película');
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
      console.error('Error al obtener detalles de la película:', error);
    // Manejar el error de alguna manera (por ejemplo, mostrar un mensaje de error en la página)
      movieDetailsDiv.innerHTML = 'Error al obtener detalles de la película';

    }
  }

// Llamar a la función para obtener detalles de la película al cargar la página
window.onload = fetchMovieDetails();