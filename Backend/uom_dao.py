def get_uoms(connection):
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT uom_id, uom_name FROM uom")
    result = cursor.fetchall()
    cursor.close()
    return result
