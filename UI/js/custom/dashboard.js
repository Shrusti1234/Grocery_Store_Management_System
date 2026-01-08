$(document).ready(function () {
    loadOrders();
});

function loadOrders() {
    $.ajax({
        url: "http://127.0.0.1:8000/getOrders",
        method: "GET",
        success: function (orders) {
            const tbody = $("#ordersTableBody");
            tbody.empty();

            if (!orders || orders.length === 0) {
                tbody.append(`
                    <tr>
                        <td colspan="4" class="text-center text-muted">
                            No orders found
                        </td>
                    </tr>
                `);
                return;
            }

            orders.forEach(order => {
                tbody.append(`
                    <tr>
                        <td>${new Date(order.datetime).toLocaleDateString()}</td>
                        <td>${order.order_id}</td>
                        <td>${order.customer_name}</td>
                        <td>${order.total}</td>
                    </tr>
                `);
            });
        },
        error: function (err) {
            console.error("API ERROR:", err);
            alert("Failed to load orders");
        }
    });
}
