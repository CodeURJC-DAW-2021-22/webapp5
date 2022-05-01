package com.softwear.webapp5.controller;

import com.softwear.webapp5.data.TransactionView;
import com.softwear.webapp5.model.Coupon;
import com.softwear.webapp5.model.Product;
import com.softwear.webapp5.model.ShopUser;
import com.softwear.webapp5.model.Transaction;
import com.softwear.webapp5.service.CouponService;
import com.softwear.webapp5.service.ProductService;
import com.softwear.webapp5.service.TransactionService;
import com.softwear.webapp5.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

@RestController
public class TransactionRESTController {

    //TODO Change URIs in phase 3

    @Autowired
    private CouponService couponService;
    @Autowired
    private ProductService productService;
    @Autowired
    private TransactionService transactionService;
    @Autowired
    private UserService userService;

    private boolean cartApplyCoupon(ShopUser user, String code) {
        Optional<Transaction> optCart = transactionService.findCart(user);
        if (optCart.isPresent()) {
            Transaction cart = optCart.get();
            Optional<Coupon> optionalCoupon = couponService.findByCode(code);
            if(optionalCoupon.isPresent()) {
                cart.setUsedCoupon(optionalCoupon.get());
                return couponService.applyCoupon(cart);
            }
        }
        return false;
    }

    @PostMapping("/cart")
    public TransactionView postCart(Model model, @RequestParam String action, @RequestParam(required=false) Long productId, @RequestParam(required=false) Integer quantity, @RequestParam(required=false) String couponCode) {
        ShopUser user = userService.findByUsername((String) model.getAttribute("username")).get();
        boolean result = false;
        if (action.equals("add")) {
            result = productId != null && quantity != null && transactionService.addToCart(productId, user, quantity);
        } else if (action.equals("delete")) {
            result = productId != null && quantity != null && transactionService.removeFromCart(productId, user, quantity);
        } else if (action.equals("deleteAll")) {
            result = productId != null && transactionService.removeAllFromCart(productId, user);
        } else if (action.equals("applyCoupon") && couponCode != null) {
            result = couponCode != null && cartApplyCoupon(user, couponCode);
        } else if (action.equals("removeCoupon")) {
            result = transactionService.removeCouponFromCart(user);
        } else if (action.equals("empty")){
            transactionService.emptyCart(user);
            result = transactionService.findCart(user).isEmpty();
            transactionService.save(new Transaction("CART", user, null, TransactionService.getCurrentDate(), new ArrayList<>()));
        }
        if(result){
            Optional<Transaction> cart = transactionService.findCart(user);
            if(cart.isPresent()){
                return new TransactionView(cart.get());
            }
        }
        return new TransactionView();
    }

    @GetMapping("/wishlist/{productId}")
    public Product productInWishlist(Model model, @PathVariable Long productId) {
        ShopUser user = userService.findByUsername((String) model.getAttribute("username")).get();
        Optional<Product> optProd = productService.findById(productId);
        if(optProd.isPresent()) {
            optProd = transactionService.findProductInWishlist(user, optProd.get().getName());
            if(optProd.isPresent()) {
                return optProd.get();
            }
        }
        return new Product();
    }

    @PostMapping("/wishlist")
    public TransactionView postWishlist(Model model, @RequestParam String action, @RequestParam(required = false) Long productId, @RequestParam(required = false) String productName) {
        ShopUser user = userService.findByUsername((String) model.getAttribute("username")).get();
        boolean result = false;
        if(action.equals("add")) {
            result = productId != null && transactionService.addToWishlist(productId, user);
        } else if(action.equals("delete")) {
            if (productId != null) {
                result = transactionService.removeFromWishlist(productId, user);
            } else if(productName != null) {
                result = transactionService.removeFromWishlist(productName, user);
            } else {
                result = false;
            }
        } else if(action.equals("empty")) {
            transactionService.emptyWishlist(user);
            result = transactionService.findWishlist(user).isEmpty();
            transactionService.save(new Transaction("WISHLIST", user, null, TransactionService.getCurrentDate(), new ArrayList<>()));
        }
        if(result) {
            Optional<Transaction> optWishlist = transactionService.findWishlist(user);
            if(optWishlist.isPresent()) {
                return new TransactionView(optWishlist.get());
            }
        }
        return new TransactionView();
    }
   

}
