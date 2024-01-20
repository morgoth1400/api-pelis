import requests
import subprocess
from bs4 import BeautifulSoup

def searchMovieInfo(movieName):
    try:
        # Buscar la película en Filmaffinity
        movieName = movieName.replace(" ", "+")
        search_url = f'https://www.filmaffinity.com/es/search.php?stext={movieName}'
        print('Peli buscada')
        try:
            response = requests.get(search_url)
            soup = BeautifulSoup(response.text, 'html.parser')
            movieLink = soup.select_one('.mc-title a')['href']
            print(movieLink)
        except TypeError as e:
            # Manejo de la excepción TypeError
            print(f"Error de tipo: {e}")
            movieResponse = requests.get(search_url)
        else:
            movieResponse = requests.get(movieLink)
        # Extraer el enlace del perfil de la primera película en los resultados
        
        
        # Ingresar al perfil de la película
        
        movieSoup = BeautifulSoup(movieResponse.text, 'html.parser')
        
        # Extraer los datos
        # info = movieSoup.select_one('.movie-info')
        title = movieSoup.find('dd').text.strip()
        year = movieSoup.find('dd', itemprop='datePublished').text.strip()
        duration = movieSoup.find('dd', itemprop='duration').text.strip().replace(" min.", "")
        director = movieSoup.select_one('.credits').text.strip()
        synopsis = movieSoup.find('dd', class_='', itemprop='description').text.replace("(FILMAFFINITY)", "").strip()
        return title, director, year, synopsis, duration
        

    except Exception as e:
        print(f'Error: {e}')

def display(title, director, year, synopsis, duration):
    print("Título: "+title)
    print("Fecha: "+year)
    print("Duración: "+duration)
    print("Director: "+director)
    print("Sinopsis: "+synopsis)

def main():
    repeat = True
    while repeat:
        movieName = input('Ingresa el nombre de la película: ')
        info = searchMovieInfo(movieName)
        display(*info)
        save = input('¿Quieres guardar esta película en la base de datos? [Y-N]\n')
        if save.lower() == 'y':
            subprocess.run(['python', 'saveMovie.py', *info])
        again = input('¿Seguir descargando información de otra película? [Y-N]\n')
        if again.lower != 'y':
            repeat = False

if __name__ == "__main__":
    main()