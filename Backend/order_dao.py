from datetime import datetime

def insert_order(connection, customer_name, total, order_details):
    cursor = connection.cursor()

    try:
        # 1️⃣ Insert into orders table
        cursor.execute(
            """
            INSERT INTO orders (`order_name`, `total`, `datetime`)
            VALUES (%s, %s, %s)
            """,
            (customer_name, total, datetime.now())
        )

        order_id = cursor.lastrowid

        # 2️⃣ Insert order details
        for item in order_details:
            cursor.execute(
                """
                INSERT INTO order_details
                (order_id, product_id, quantity, total_price)
                VALUES (%s, %s, %s, %s)
                """,
                (
                    order_id,
                    int(item["product_id"]),
                    float(item["quantity"]),
                    float(item["total_price"])
                )
            )

        # 3️⃣ Commit ONLY after everything succeeds
        connection.commit()
        return order_id

    except Exception as e:
        import traceback
        print("❌ ERROR WHILE INSERTING ORDER DETAILS")
        traceback.print_exc()   # 🔥 THIS SHOWS REAL ERROR
        connection.rollback()
        raise e



def get_all_orders(connection):
    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            order_id,
            order_name AS customer_name,
            total,
            datetime
        FROM orders
        ORDER BY order_id DESC
        """
    )

    result = cursor.fetchall()
    cursor.close()
    return result
