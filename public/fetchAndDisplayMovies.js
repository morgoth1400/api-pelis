async function fetchAndDisplayMovies() {
  const movieListElement = document.getElementById('movieList');

  try {
    const response = await fetch('http://localhost:1972/api/movies');
    const moviesData = await response.json();

    const ulElement = document.createElement('ul');

    moviesData.forEach(movie => {
      const liElement = document.createElement('li');
      liElement.textContent = `${movie.title} (${movie.year}) - Dirigida por ${movie.director}`;
      ulElement.appendChild(liElement);
    });

    movieListElement.appendChild(ulElement);
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
    movieListElement.textContent = 'Error al obtener datos de la API.';
  }
}

window.onload = fetchAndDisplayMovies;