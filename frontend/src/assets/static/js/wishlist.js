let token = ""

function updateWishlist(wishlist, id) {
    if(wishlist != null) {
        let i = 0;
        while(i< wishlist.transactionEntries.length &&  wishlist.transactionEntries[i].product.id !== id) {
            i++;
        }
        if(i ===  wishlist.transactionEntries.length) {
            $("tr#product_"+id).remove();
            for(let i=0; i< wishlist.transactionEntries.length; i++) {
                if(Number($("tr#product_"+ wishlist.transactionEntries[i].product.id).find("td.product-index").html().substring(1)) !== i+1) {
                    $("tr#product_"+ wishlist.transactionEntries[i].product.id).find("td.product-index").html("#" + Number(i+1));
                }
            }
        }
    }
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

function buy(id) {
    $.ajax({
            url: "/cart",
            type: "POST",
            data: {
                action: "add",
                productId: id,
                quantity: 1,
                _csrf: token
            },
            dataType: "json"
    }).done(function (cart) {
        if(cart.id !== 0) {
            updateCartItemsNumber(cart);
        }
    });
}

function deleteFromWishlist(id) {
    $.ajax({
        url: "/wishlist",
        type: "POST",
        data: {
            action: "delete",
            productId: id,
            _csrf: token
        },
        dataType: "json"
    }).done(function (wishlist) {
        if(wishlist.id !== 0) {
            updateWishlist(wishlist, id);
        }
    });
}

function empty() {
    $.ajax({
        url: "/wishlist",
        type: "POST",
        data: {
            action: "empty",
            _csrf: token
        },
        dataType: "json"
    }).done(function (wishlist) {
        $(".product-row").each(function () {
            $(this).remove();
        });
    });
}

$(document).ready(function () {
    token = $("#csrf-token").attr("content");
});