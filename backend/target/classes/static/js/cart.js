let token = "";

$("document").ready(function () {
    if($(".cart-coupon-row").length) {
        $("#apply-coupon").hide();
        $("#wrong-coupon").hide();
        $("#valid-coupon").show();
    } else {
        hideCouponLabels();
    }
    token = $("#csrf-token").attr("content");
})

function createCouponRow(cart) {
    $("tbody.cart").append("<tr class=\"cart-coupon-row\">" +
        "<td></td>" +
        "<td class=\"cart-text text-right coupon-name\">Discount coupon " + cart.coupon.code + ":</td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td class=\"cart-text text-right coupon-discount\">-$" + cart.discount + "</td>" +
        "<td class=\"cart-text text-right\">" +
        "<button class=\"btn btn-outline-dark fw-bold\"  onclick=\"removeCoupon()\">Delete</button>" +
        "</td>" +
        "</tr>");
}

function updateCartItemsNumber(cart) {
    let number = 0;
    if(cart != null) {
        for(const entry of cart.transactionEntries) {
            number += entry.quantity;
        }
    }
    $(".cart-items-number").html(number);
}

function updateTotalPrice(cart) {
    if(cart != null) {
        $(".cart-total-price").html("$" + cart.totalPrice);
    } else {
        $(".cart-total-price").html("$0")
    }
}

function updateProduct(cart, id) {
    let i = 0;
    while(i<cart.transactionEntries.length && cart.transactionEntries[i].product.id !== id) {
        i++;
    }
    if(i === cart.transactionEntries.length) {
        $("tr#product_"+id).remove();
        for(let i=0; i<cart.transactionEntries.length; i++) {
            if(Number($("tr#product_"+cart.transactionEntries[i].product.id).find("td.product-index").html().substring(1)) !== i+1) {
                $("tr#product_"+cart.transactionEntries[i].product.id).find("td.product-index").html("#" + Number(i+1));
            }
        }
    } else {
        let product = $("tr#product_" + id)
        product.find("td.product-quantity").html(cart.transactionEntries[i].quantity);
        product.find("td.product-total-price").html("$" + cart.transactionEntries[i].totalPrice);
    }
}

function updateCoupon(cart) {
    let coupon_row = $(".cart-coupon-row");
    if(cart != null && cart.coupon != null) {
        if(coupon_row.length === 0) {
            createCouponRow(cart);
        }
        coupon_row.find(".coupon-name").html("Discount coupon " + cart.coupon.code + ":");
        coupon_row.find(".coupon-discount").html("-$" + cart.coupon.discount);
        $("#apply-coupon").hide();
        $("#wrong-coupon").hide();
        $("#valid-coupon").show();
    } else {
        if (coupon_row.length) {
            coupon_row.remove();
            $("#valid-coupon").hide();
        }
        $("#apply-coupon").show();
    }
}

function hideCouponLabels() {
    $("#valid-coupon").hide();
    $("#wrong-coupon").hide();
    $("#apply-coupon").show();
}

function addProduct(id, quantity) {
    $.ajax({
        url: "/cart",
        type: "POST",
        data: {
            action: "add",
            productId: id,
            quantity: quantity,
            _csrf: token
        },
        dataType: "json"
    }).done(function (cart) {
        if (cart.id !== 0) {
            updateCartItemsNumber(cart);
            updateProduct(cart, id);
            updateCoupon(cart);
            updateTotalPrice(cart);
        }
    }).fail( function( jqXHR, textStatus, errorThrown ) {
        console.log("ADD_FAIL")
        console.log("jqXHR:");
        console.log(jqXHR);
        console.log("textStatus:");
        console.log(textStatus);
        console.log("errorThrown:");
        console.log(errorThrown);
    });
}

function deleteProduct(id, quantity) {
    $.ajax({
        url: "/cart",
        type: "POST",
        data: {
            action: "delete",
            productId: id,
            quantity: quantity,
            _csrf: token
        },
        dataType: "json"
    }).done(function (cart) {
        if (cart.id !== 0) {
            updateCartItemsNumber(cart);
            updateProduct(cart, id);
            updateCoupon(cart);
            updateTotalPrice(cart);
        }
    });
}

function deleteAllOfProduct(id) {
    $.ajax({
        url: "/cart",
        type: "POST",
        data: {
            action: "deleteAll",
            productId: id,
            _csrf: token
        },
        dataType: "json"
    }).done(function (cart) {
        if (cart.id !== 0) {
            updateCartItemsNumber(cart);
            updateProduct(cart, id);
            updateCoupon(cart);
            updateTotalPrice(cart);
        }
    })
}

function applyCoupon() {
    let code = $("#coupon-code").find("input").val()
    $.ajax({
        url: "/cart",
        type: "POST",
        data: {
            action: "applyCoupon",
            couponCode: code,
            _csrf: token
        },
        dataType: "json"
    }).done(function (cart) {
        if (cart.id !== 0) {
            $("#apply-coupon").hide();
            $("#wrong-coupon").hide();
            $("#valid-coupon").show();
            updateTotalPrice(cart);
        } else {
            $("#wrong-coupon").show();
        }
        updateCoupon(cart);
    });
}

function removeCoupon() {
    $.ajax({
        url: "/cart",
        type: "POST",
        data: {
            action: "removeCoupon",
            _csrf: token
        },
        dataType: "json"
    }).done(function (cart) {
        if (cart.id !== 0) {
            hideCouponLabels();
            updateCoupon(cart);
            updateTotalPrice(cart);
        }
    })
}

function emptyCart() {
    $.ajax({
        url: "/cart",
        type: "POST",
        data: {
            action: "empty",
            _csrf: token
        },
        dataType: "json"
    }).done(function(cart) {
        $(".product-row").each(function () {
            $(this).remove();
        });
        updateCartItemsNumber(null);
        updateCoupon(null);
        updateTotalPrice(null);
    })

}
