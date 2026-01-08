def get_all_products(connection):
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT p.product_id, p.name, p.price_per_unit, u.uom_name, p.uom_id
        FROM products p
        JOIN uom u ON p.uom_id = u.uom_id
    """
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    return result

def insert_product(connection, product):
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO products (name, uom_id, price_per_unit)
        VALUES (%s, %s, %s)
        """,
        (
            product["name"],
            product["uom_id"],
            product["price_per_unit"]
        )
    )

    connection.commit()
    cursor.close()


def delete_product(connection, product_id):
    cursor = connection.cursor()
    cursor.execute("DELETE FROM products WHERE product_id=%s", (product_id,))
    connection.commit()
    cursor.close()
