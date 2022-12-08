/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable indent */
/* eslint-disable no-undef */
/* eslint-disable no-trailing-spaces */

function changeQuantity(productId, cartId, count, qty) {
    $.ajax({
        url: '/change-product-quantity',
        data: {
            cart: cartId,
            product: productId,
            count,
        },
        method: 'post',
        success: (res) => {
            // document.getElementById('quantity').innerText = Number(qty) + Number(count);
            location.reload();
            // $('#quantity').load(`${document.URL} #quantity`);
        },
    });
}

function deleteCartItem(productId, cartId) {
    $.ajax({
        url: '/delete-cart-product',
        data: {
            cart: cartId,
            product: productId,
        },
        method: 'post',
        success: () => {
            location.reload();
        },
    });
}
