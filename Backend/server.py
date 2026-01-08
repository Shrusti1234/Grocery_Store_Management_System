from flask import Flask, request, jsonify
from flask_cors import CORS
import sql_connection
import product_dao
import order_dao
import uom_dao

app = Flask(__name__)
CORS(app)

connection = sql_connection.get_sql_connection()

# ---------------- PRODUCTS ----------------

@app.route("/getOrders", methods=["GET"])
def get_orders():
    try:
        connection = sql_connection.get_sql_connection()
        orders = order_dao.get_all_orders(connection)
        return jsonify(orders)
    except Exception as e:
        print("❌ ERROR in getOrders:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/getproducts", methods=["GET"])
def get_products():
    products = product_dao.get_all_products(connection)
    return jsonify(products)

@app.route("/getUOMs", methods=["GET"])
def get_uoms():
    return jsonify(uom_dao.get_uoms(connection))


@app.route("/insertProduct", methods=["POST"])
def insert_product():
    data = request.json

    if not all(k in data for k in ("name", "uom_id", "price_per_unit")):
        return jsonify({"error": "Invalid data"}), 400

    product_dao.insert_product(connection, data)
    return jsonify({"message": "Product inserted"}), 200


@app.route("/deleteProducts", methods=["POST"])
def delete_product():
    data = request.get_json()

    if "product_id" not in data:
        return jsonify({"error": "product_id required"}), 400

    product_dao.delete_product(connection, data["product_id"])
    return jsonify({"message": "Product deleted"}), 200

# ---------------- ORDERS ----------------
@app.route("/insertOrder", methods=["POST"])
def insert_order():
    try:
        connection = sql_connection.get_sql_connection()
        data = request.get_json()

        customer_name = data.get("customer_name")
        total = float(data["total"])   # ✅ FIXED LINE
        order_details = data.get("order_details")


        if not customer_name:
            return jsonify({"error": "customer_name missing"}), 400

        if not order_details or len(order_details) == 0:
            return jsonify({"error": "order_details empty"}), 400

        if total <= 0:
            return jsonify({"error": "Total must be greater than 0"}), 400

        order_id = order_dao.insert_order(
            connection,
            customer_name,
            total,
            order_details
        )

        return jsonify({
            "message": "Order saved successfully",
            "order_id": order_id
        }), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/deleteOrder", methods=["POST"])
def delete_order():
    connection = sql_connection.get_sql_connection()
    data = request.get_json()
    order_id = data.get("order_id")

    cursor = connection.cursor()
    cursor.execute("DELETE FROM orders WHERE order_id = %s", (order_id,))
    connection.commit()

    return jsonify({"message": "Order deleted"}), 200

@app.route("/getOrderDetails/<int:order_id>", methods=["GET"])
def get_order_details(order_id):
    connection = sql_connection.get_sql_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            od.product_id,
            p.name AS product_name,
            p.price,
            od.quantity,
            od.total_price
        FROM order_details od
        JOIN products p ON od.product_id = p.product_id
        WHERE od.order_id = %s
    """, (order_id,))

    return jsonify(cursor.fetchall())

@app.route("/updateOrder", methods=["POST"])
def update_order():
    connection = sql_connection.get_sql_connection()
    data = request.get_json()

    order_id = data["order_id"]
    customer_name = data["customer_name"]
    total = data["total"]
    order_details = data["order_details"]

    cursor = connection.cursor()

    # Update orders table
    cursor.execute(
        "UPDATE orders SET order_name=%s, total=%s WHERE order_id=%s",
        (customer_name, total, order_id)
    )

    # Remove old items
    cursor.execute("DELETE FROM order_details WHERE order_id=%s", (order_id,))

    # Insert updated items
    for item in order_details:
        cursor.execute("""
            INSERT INTO order_details (order_id, product_id, quantity, total_price)
            VALUES (%s, %s, %s, %s)
        """, (order_id, item["product_id"], item["quantity"], item["total_price"]))

    connection.commit()
    return jsonify({"message": "Order updated successfully"}), 200


if __name__ == "__main__":
    app.run(port=8000, debug=True)
