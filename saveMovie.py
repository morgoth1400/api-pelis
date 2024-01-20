import mysql.connector
import json
import sys

with open('config.json') as config_file:
    config_data = json.load(config_file)

mysql_config = config_data.get("mysql", {})

# Conectar a la base de datos
try:
    connection = mysql.connector.connect(**mysql_config)

    if connection.is_connected():
        cursor = connection.cursor()

        # Aquí puedes ejecutar consultas SQL
        title, director, year, synopsis, duration = sys.argv[1:]
        data = (title, director, year, synopsis, duration)
        # Insertar datos en la tabla
        insert_data_query = """
        INSERT INTO movies (title, director, year, synopsis, duration) VALUES (%s, %s, %s, %s, %s)
        """
        print(insert_data_query % data)
        cursor.execute(insert_data_query, data)
        # Hacer commit para confirmar los cambios en la base de datos
        connection.commit()

except Exception as e:
    print(f"Error: {e}")

finally:
    # Cerrar el cursor y la conexión
    if 'cursor' in locals():
        cursor.close()
    if 'connection' in locals() and connection.is_connected():
        connection.close()
        print("Conexión cerrada.")