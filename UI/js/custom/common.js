// Define your api here
var productListApiUrl = 'http://127.0.0.1:8000/getproducts';
var uomListApiUrl = 'http://127.0.0.1:8000/getUOM';
var productSaveApiUrl = 'http://127.0.0.1:8000/insertProduct';
var productDeleteApiUrl = 'http://127.0.0.1:8000/deleteProducts';
var orderListApiUrl = 'http://127.0.0.1:8000/getAllOrders';
var orderSaveApiUrl = 'http://127.0.0.1:8000/insertOrder';

const BASE_URL = "http://127.0.0.1:8000";

function apiGet(url) {
    return $.ajax({
        url: BASE_URL + url,
        method: "GET",
        contentType: "application/json"
    });
}

function apiPost(url, data) {
    return $.ajax({
        url: BASE_URL + url,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(data)
    });
}


function callApi(method, url, data, successCallback) {
    $.ajax({
        method: method,
        url: url,
        contentType: "application/json",
        data: data,
        success: function (response) {
            successCallback(response);
        },
        error: function (xhr) {
            console.error("API Error:", xhr.responseText);
            alert("❌ Failed to save. Please try again.");
        }
    });
}


function calculateValue() {
    var total = 0;
    $(".product-item").each(function () {
        var qty = parseFloat($(this).find('.product-qty').val());
        var price = parseFloat($(this).find('#product_price').val());
        var itemTotal = price * qty;
        $(this).find('#item_total').val(itemTotal.toFixed(2));
        total += itemTotal;
    });
    $("#product_grand_total").val(total.toFixed(2));
}
