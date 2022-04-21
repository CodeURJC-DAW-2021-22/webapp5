let token = "";
let currentPage = 0;
let maxPages = 0;

function updateWishlistLabels() {
    $(".product").each(function () {
        let id = Number($(
            this).find(".product-id").attr("content"));
        updateWishlistLabel(id);
    })
}

function updateWishlistLabel(productId) {
    $.ajax({
        url: "/wishlist/" + productId,
        type: "get",
        dataType: "json"
    }).done(function (product) {
        let badge = "#product-"+productId+"-fav-badge";
        let icon = "#product-"+productId+"-fav-icon";
        if(product.id == null || product.id === 0) {
            if($(badge).hasClass("bg-dark")) {
                $(badge).removeClass("bg-dark");
                $(badge).removeClass("text-white");
            }
            if(!$(badge).hasClass("bg-white")) {
                $(badge).addClass("bg-white");
                $(badge).addClass("text-black");
            }
            $(icon).hide();
        } else {
            if($(badge).hasClass("bg-white")) {
                $(badge).removeClass("bg-white");
                $(badge).removeClass("text-black");
            }
            if(!$(badge).hasClass("bg-dark")) {
                $(badge).addClass("bg-dark");
                $(badge).addClass("text-white");
            }
            $(icon).show();
        }
    });
}

function toggleWishlistLabel(productName) {
    let ids = [];
    $(".product").each(function () {
        if($(this).find(".product-name").html() === productName) {
            ids.push(Number($(this).find(".product-id").attr("content")));
        }
    });
    for(let index=0; index<ids.length; index++) {
        let productId = ids[index];
        let badge = "#product-" + productId + "-fav-badge";
        let icon = "#product-" + productId + "-fav-icon";
        if ($(badge).hasClass("bg-dark")) {
            $(badge).removeClass("bg-dark");
            $(badge).removeClass("text-white");
            $(badge).addClass("bg-white");
            $(badge).addClass("text-black");
            $(icon).hide();
        } else {
            $(badge).removeClass("bg-white");
            $(badge).removeClass("text-black");
            $(badge).addClass("bg-dark");
            $(badge).addClass("text-white");
            $(icon).show();
        }
    }
}

function wishlist(productId, productName) {
    $.ajax({
        url: "/wishlist/" + productId,
        type: "get",
        dataType: "json"
    }).done(function (product) {
        if(product.id != null && product.id !== 0) {
            removeFromWishlist(productId, productName);
        } else {
            addToWishlist(productId, productName);
        }
        updateWishlistLabel(productId);
    });
}

function addToWishlist(productId, productName) {
    $.ajax({
        url: "/wishlist",
        type: "post",
        data: {
            action: "add",
            productId: productId,
            _csrf: token
        },
        dataType: "json"
    }).done(function (wishlist) {
        if(wishlist.id !== 0) {
            toggleWishlistLabel(productName);
        }
    });
}

function removeFromWishlist(productId, productName) {
    $.ajax({
        url: "/wishlist",
        type: "post",
        data: {
            action: "delete",
            productName: productName,
            _csrf: token
        },
        dataType: "json"
    }).done(function (wishlist) {
        if(wishlist.id !== 0) {
            toggleWishlistLabel(productName);
        }
    });

}

function hideWishlistIfNReg() {
    let registered = !($("#username").attr("content") === "");
    if (!registered) {
        $(".product-fav-icon").each(function () {
            $(this).hide();
        })
        $(".product-fav-badge").each(function () {
            $(this).hide();
        })
    }
    return registered;
}

$(document).ready(function () {
    token = $("#csrf-token").attr("content");
    maxPages = Number($("#max-pages").attr("content"));
    if (hideWishlistIfNReg()) {
        updateWishlistLabels();
    }
});





function more() {
    if(currentPage < maxPages - 1) {
        $.ajax({
            url: "/products/" + (currentPage + 1),
            type: "get",
            dataType: "json"
        }).done(function (products) {
        	for(let i=0; i<products.length; i++) {
        		let product= products[i];
        		let img= product.images[0];
        		$("#products").append("<div class=\"col mb-5\">\r\n"
        				+ "                        <div id=\"product-"+product.id+"\" class=\"card h-100 product\">\r\n"
        				+ "                            <meta class=\"product-id\" content=\""+product.id+"\"/>\r\n"
        				+ "                            <!-- Fav badge-->\r\n"
        				+ "                            <div id=\"product-"+product.id+"-fav-badge\" class=\"badge product-fav-badge bg-dark text-white position-absolute favIcon\" onclick=\"wishlist("+product.id+", '"+product.name+"')\"><i class=\"fa-solid fa-heart\"></i></div>\r\n"
        				+ "                            <!-- Product image-->\r\n"
        				+ "                            <a href=\"/productView/"+product.id+"\"><img class=\"card-img-top\" src=\""+img+"\" alt=\"Product"+product.id+"\" /></a>\r\n"
        				+ "                            <!-- Product details-->\r\n"
        				+ "                            <div class=\"card-body p-4\">\r\n"
        				+ "                                <div class=\"text-center\">\r\n"
        				+ "                                    <!-- Product name-->\r\n"
        				+ "                                    <h5 class=\"fw-bolder product-name\">"+product.name+"</h5>\r\n"
        				+ "                                    <!-- Product price-->\r\n"
        				+ "                                    $"+product.price+"\r\n"
        				+ "                                </div>\r\n"
        				+ "                            </div>\r\n"
        				+ "                            <!-- Product actions-->\r\n"
        				+ "                            <div class=\"card-footer p-4 pt-0 border-top-0 bg-transparent product-actions\">\r\n"
        				+ "                                <div class=\"text-center\"><a class=\"btn btn-outline-dark mt-auto\" href=\"/productView/"+product.id+"\">View options</a></div>\r\n"
        				+ "                                <!-- if product is in wish list print fav icon -->\r\n"
        				+ "                                <i id=\"product-"+product.id+"-fav-icon\" class=\"product-fav-icon fa-solid fa-heart\"></i>\r\n"
        				+ "                            </div>\r\n"
        				+ "                        </div>\r\n"
        				+ "                    </div>");
        		if(hideWishlistIfNReg()){
                    updateWishlistLabel(product.id);
                }
        	}
        	currentPage++;
            if(currentPage >= maxPages - 1) {
                $("#more-btn").hide();
            }
        });
    }
}