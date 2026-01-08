const API_BASE = "http://127.0.0.1:8000";
let products = [];

$(document).ready(function () {
    loadProducts();

    $("#addMoreBtn").on("click", addRow);
    $("#saveOrderBtn").on("click", saveOrder);
});

/* ---------- LOAD PRODUCTS ---------- */
function loadProducts() {
    $.get(`${API_BASE}/getproducts`, function (data) {
        products = data;
        addRow();
    });
}

/* ---------- ADD ROW ---------- */
function addRow() {
    const row = `
        <tr>
            <td>
                <select class="form-control product">
                    <option value="">Select</option>
                    ${products.map(p =>
                        `<option value="${p.product_id}" data-price="${p.price_per_unit}">
                            ${p.name}
                        </option>`
                    ).join("")}
                </select>
            </td>

            <td>
                <input type="number" class="form-control price" readonly>
            </td>

            <td>
                <input type="number" class="form-control qty" value="1" min="1">
            </td>

            <td>
                <input type="number" class="form-control total" readonly>
            </td>

            <td>
                <button type="button" class="btn btn-danger remove">X</button>
            </td>
        </tr>
    `;
    $("#orderTable tbody").append(row);
}

/* ---------- EVENTS ---------- */
$(document).on("change", ".product", function () {
    const row = $(this).closest("tr");
    const price = Number($(this).find(":selected").data("price")) || 0;

    row.find(".price").val(price);
    calculateRow(row);
});

$(document).on("input", ".qty", function () {
    const row = $(this).closest("tr");
    calculateRow(row);
});

$(document).on("click", ".remove", function () {
    $(this).closest("tr").remove();
    calculateGrandTotal();
});

function calculateRow(row) {
    const price = Number(row.find(".price").val()) || 0;
    const quantity = Number(row.find(".qty").val()) || 0;

    const rowTotal = price * quantity;
    row.find(".total").val(rowTotal);

    calculateGrandTotal();
}

function calculateGrandTotal() {
    let grandTotal = 0;

    $(".total").each(function () {
        grandTotal += Number($(this).val()) || 0;
    });

    $("#grandTotal").val(grandTotal.toFixed(2));
}


function saveOrder() {
    const customerName = $("#customerName").val().trim();

    if (!customerName) {
        alert("Customer name required");
        return;
    }

    let orderDetails = [];

    $("#orderTable tbody tr").each(function () {
        const row = $(this);

        // 🔥 force calculation
        const price = Number(row.find(".price").val()) || 0;
        const quantity = Number(row.find(".qty").val()) || 0;
        const rowTotal = price * quantity;

        row.find(".total").val(rowTotal);

        const productId = Number(row.find(".product").val());

        if (productId && quantity > 0) {
            orderDetails.push({
                product_id: productId,
                quantity: quantity,
                total_price: rowTotal
            });
        }
    });

    if (orderDetails.length === 0) {
        alert("Add at least one product");
        return;
    }

    if (orderDetails.some(item => item.total_price <= 0)) {
        alert("Total price calculation error. Please recheck products and quantity.");
        return;
    }

    // 🔥 VERY IMPORTANT
    calculateGrandTotal();

    const payload = {
        customer_name: customerName,
        total: Number($("#grandTotal").val()),
        order_details: orderDetails
    };

    console.log("SENDING PAYLOAD:", payload);

    $.ajax({
        url: `${API_BASE}/insertOrder`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(payload),

        success: function () {
            alert("✅ Order saved successfully");
            window.location.href = "index.html";
        },

        error: function (xhr) {
            console.error("STATUS:", xhr.status);
            console.error("RESPONSE:", xhr.responseText);
            alert("❌ Failed to save order. Check console.");
        }


        // error: function (err) {
        //     alert("❌ Failed to save order");
        // }
    });
}

function loadOrderForEdit(orderId) {
    $.get(`http://127.0.0.1:8000/getOrderDetails/${orderId}`, function (items) {

        $("#saveOrderBtn").text("Update Order");

        $("#orderTable tbody").empty();

        items.forEach(item => {
            addRow();
            const row = $("#orderTable tbody tr").last();

            row.find(".product").val(item.product_id);
            row.find(".qty").val(item.quantity);
            row.find(".price").val(item.price);
            row.find(".total").val(item.total_price);
        });

        calculateGrandTotal();
    });
}
