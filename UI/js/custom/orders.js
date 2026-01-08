const API_BASE = "http://127.0.0.1:8000";

$(document).ready(function () {
    loadOrders();
});

function loadOrders() {
    $.get("http://127.0.0.1:8000/getOrders", function (orders) {
        const tbody = $("#ordersTable");
        tbody.empty();

        orders.forEach(order => {
            tbody.append(`
                <tr>
                    <td>${order.order_id}</td>
                    <td>${order.customer_name}</td>
                    <td>₹ ${order.total}</td>
                    <td>${new Date(order.datetime).toLocaleString()}</td>
                    <td>
                        <button class="btn btn-warning btn-sm"
                            onclick="editOrder(${order.order_id})">
                            Edit
                        </button>

                        <button class="btn btn-danger btn-sm"
                            onclick="deleteOrder(${order.order_id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `);
        });
    });
}


function deleteOrder(orderId) {
    if (!confirm("Delete this order?")) return;

    $.ajax({
        url: `${API_BASE}/deleteOrder`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ order_id: orderId }),
        success: function () {
            alert("Order deleted");
            loadOrders();
        }
    });
}

function editOrder(orderId) {
    // Redirect to index.html with order_id
    window.location.href = `index.html?editOrderId=${orderId}`;
}
