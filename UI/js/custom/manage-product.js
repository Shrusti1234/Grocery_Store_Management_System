$(document).ready(function () {
    loadProducts();

    $("#addProductForm").submit(function (e) {
        e.preventDefault();

        const name = $("#productName").val().trim();
        const price = parseFloat($("#productPrice").val());

        if (!name || isNaN(price)) {
            alert("Please enter valid product details");
            return;
        }

        const payload = {
            name: name,
            uom_id: 1, // each
            price_per_unit: price
        };

        apiPost("/insertProduct", payload)
            .done(() => {
                $("#addProductModal").modal("hide");
                $("#addProductForm")[0].reset();
                loadProducts();
            })
            .fail(() => alert("Failed to save product"));
    });
});

function loadProducts() {
    apiGet("/getproducts").done(products => {
        const tbody = $("#productsTableBody");
        tbody.empty();

        products.forEach(p => {
            tbody.append(`
                <tr>
                    <td>${p.name}</td>
                    <td>${p.uom_name}</td>
                    <td>${p.price_per_unit}</td>
                    <td>
                        <button class="btn btn-danger btn-sm"
                            onclick="deleteProduct(${p.product_id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `);
        });
    });
}

function deleteProduct(id) {
    apiPost("/deleteProducts", { product_id: id })
        .done(loadProducts)
        .fail(() => alert("❌ Cannot delete product linked to orders"));
}


fetch("http://127.0.0.1:8000/insertOrder", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
})
.then(res => res.json())
.then(data => {
  alert("Order saved successfully");
  console.log(data);
})
.catch(err => {
  console.error("ERROR:", err);
});
