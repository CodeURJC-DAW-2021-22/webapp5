let inWishlist;
let size;
let token = "";

function hideActionLabels() {
	$(".msg-label").each(function () {
		$(this).hide();
	});
}

function labelTransition(action) {
	console.log($("#" + action + "-label"))
	$("#" + action + "-label").fadeIn(250);
	setTimeout($("#" + action + "-label").fadeOut(2000), 3000);
}

function showProduct(product) {

	$("#product-featured")[0].src= product.img_routes[0];
	$("img.product-thumbnail")[0].src= product.img_routes[0];
	$("h1.softFont")[0].innerHTML = product.name;
	$("h3")[0].innerHTML = "$"+ product.price;
	$("p.product-description")[0].innerHTML = product.description;
	
}

function getProduct(name, size, callback) {
	const productUrl = `/api/products`
	$.ajax({
		url: productUrl,
		type: "get",
		data: {
			name: $(".product-name").html(),
			size: size
		},
		dataType: "json"
	}).done(function (product){
		callback(product)
	});
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

function updateStock() {
	getProduct($(".product-name").html(),size, function (product){
		let product_stock = $(".product-stock")
		let row = product_stock.parent()
		product_stock.remove()
		let productObj = product[0]
		if(productObj.stock > 0) {
			if(productObj.stock > 20) {
				row.append("<div class=\"product-stock col-6 rounded p-1 text-center text-white fs-4 bg-success softFont\">In Stock</div>")
			} else {
				row.append("<div class=\"product-stock col-6 rounded p-1 text-center fs-5 bg-warning softFont\">Low Stock: Only " + productObj.stock + " units available</div>")
			}
			if($("#cart-btn").hasClass("disabled")) {
				$("#cart-btn").removeClass("disabled");
			}
		} else {
			row.append("<div class=\"product-stock col-6 rounded p-1 text-center text-white fs-4 bg-danger softFont\">Out of Stock</div>")
			if(!$("#cart-btn").hasClass("disabled")) {
				$("#cart-btn").addClass("disabled");
			}
		}
	})
}

function addToCart(id, quantity) {
	$.ajax({
		url: "/cart",
		type: "post",
		data:{
			action: "add",
			productId: id,
			quantity: quantity,
			_csrf: token
		},
		dataType: "json"
	}).done(function (cart) {
		if(cart != null){
			updateCartItemsNumber(cart);
			labelTransition("cart-add");
		}
	});
}

function wishlist(productId, productName) {
	if(inWishlist) {
		removeFromWishlist(productName);
	} else {
		addToWishlist(productId);
	}
}

function addToWishlist(productId) {
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
			inWishlist = true
			let fav_btn = $("#fav-btn");
			fav_btn.addClass("bg-dark");
			fav_btn.addClass("text-white");
			labelTransition("wishlist-add");
		}
	});
}

function removeFromWishlist(productName) {
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
			inWishlist = false;
			let fav_btn = $("#fav-btn");
			fav_btn.removeClass("bg-dark");
			fav_btn.removeClass("text-white");
			labelTransition("wishlist-remove");
		}
	});

}

function changeSize(new_size) {
	$(".product-size").each(function () {
		if($(this).hasClass("bg-dark")) {
			$(this).removeClass("bg-dark");
		}
		if($(this).hasClass("text-white")) {
			$(this).removeClass("text-white");
		}
	})
	$("#btn-size-"+new_size).addClass("bg-dark");
	$("#btn-size-"+new_size).addClass("text-white");
	size = new_size;
	updateStock();
}

$(document).ready(function () {

	token = $("#csrf-token").attr("content");

	let thumbnails = document.getElementsByClassName('product-thumbnail')

	let activeImages = document.getElementsByClassName('product-active')

	for (var i=0; i < thumbnails.length; i++){

		thumbnails[i].addEventListener('mouseover', function(){
			console.log(activeImages)

			if (activeImages.length > 0){
				activeImages[0].classList.remove('product-active')
			}


			this.classList.add('product-active')
			document.getElementById('product-featured').src = this.src
		})
	}

	let buttonRight = document.getElementById('product-slideRight');
	let buttonLeft = document.getElementById('product-slideLeft');

	buttonLeft.addEventListener('click', function(){
		document.getElementById('product-slider').scrollLeft -= 180
	})

	buttonRight.addEventListener('click', function(){
		document.getElementById('product-slider').scrollLeft += 180
	})

	inWishlist = $("#fav-btn").hasClass("bg-dark")
	$("#cart-form").submit(function (event) {
		event.preventDefault();
		getProduct($(".product-name").html(), size, function (product){
			let values = {}
			$.each($('#cart-form').serializeArray(), function (i, field) {
				values[field.name] = Number(field.value);
			});
			addToCart(product.id, values["quantity"]);
		})
	})
	size = $(".product-size").html();
	changeSize(size);
	hideActionLabels();

})