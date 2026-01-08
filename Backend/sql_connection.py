import mysql.connector
from mysql.connector import Error

__cnx = None

def get_sql_connection():
    global __cnx

    try:
        # If connection is not created OR connection is closed
        if __cnx is None or not __cnx.is_connected():
            print("Opening MySQL connection...")
            __cnx = mysql.connector.connect(
                host="127.0.0.1",
                user="root",
                password="Root@123",  
                database="grocery_store",
                autocommit=False
            )

        return __cnx

    except Error as e:
        print("❌ Error while connecting to MySQL:", e)
        return None


