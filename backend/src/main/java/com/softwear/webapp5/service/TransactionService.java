package com.softwear.webapp5.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.softwear.webapp5.data.StaticDTO;
import com.softwear.webapp5.model.*;
import com.softwear.webapp5.repository.ProductRepository;
import com.softwear.webapp5.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {

    @Autowired
    private CouponService couponService;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ProductRepository productRepository;

    public static String getCurrentDate() {
        Calendar calendar = Calendar.getInstance();
        return String.format("%02d", calendar.get(Calendar.DAY_OF_MONTH)) + "/" + String.format("%02d", calendar.get(Calendar.MONTH)) + "/" + Integer.toString(calendar.get(Calendar.YEAR));
    }

    public Optional<Transaction> findById(Long id) {
        return transactionRepository.findById(id);
    }

    public List<Transaction> findAll() {
        return transactionRepository.findAll();
    }

    public List<Transaction> findByType(String type) {
        return transactionRepository.findByType(type);
    }

    public Page<Transaction> findByType(String type, Pageable page) {
        return transactionRepository.findByType(type, page);
    }

    public List<Transaction> findByUser(ShopUser user) {
        return transactionRepository.findByUser(user);
    }

    public List<Transaction> findByUsedCoupon(Coupon coupon) {
        return transactionRepository.findByUsedCoupon(coupon);
    }

    public List<Transaction> findByDate(String date) {
        return transactionRepository.findByDate(date);
    }
 
    public Page<Transaction> findCart(ShopUser user, Pageable page) {
        return transactionRepository.findCart(user, PageRequest.of(0, 10));
    }
    
    public Optional<Transaction> findCart(ShopUser user) {
        return transactionRepository.findCart(user);
    }

    public Page<Transaction> findWishlist(ShopUser user, Pageable page) {
        return transactionRepository.findWishlist(user, PageRequest.of(0, 10));
    }
    
    public Optional<Transaction> findWishlist(ShopUser user) {
        return transactionRepository.findWishlist(user);
    }

    public Optional<Product> findProductInWishlist(ShopUser user, String productName) {
        return transactionRepository.findProductInWishlist(user, productName);
    }

    public Page<Transaction> findPurchaseHistory(ShopUser user, Pageable pageable) {
    	return transactionRepository.findPurchaseHistory(user, pageable);
    }
    
    public List<Transaction> findPurchaseHistory(ShopUser user) {
        return transactionRepository.findPurchaseHistory(user);
    }

    public void save(Transaction transaction) {
        transactionRepository.save(transaction);
    }

    public void delete(Transaction transaction) {
        transactionRepository.delete(transaction);
    }

    public void updateAndSave(Transaction transaction) {
        transaction.setTotalPrice(transaction.calculateTotalProductPrice());
        if(!couponService.applyCoupon(transaction)) {
            transactionRepository.save(transaction);
        }
    }

    public boolean addToCart(Long productId, ShopUser user, int quantity) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isPresent()){
            Product product = optionalProduct.get();
            Optional<Transaction> optionalTransaction = transactionRepository.findCart(user);
            Transaction cart;
            if (optionalTransaction.isPresent()) {
                cart = optionalTransaction.get();
            } else {
                cart = new Transaction("CART", user, null, getCurrentDate(), new ArrayList<>());
            }
            for(int i=0; i<quantity; i++) {
                cart.getProducts().add(product);
            }
            updateAndSave(cart);
            return true;
        }
        return false;
    }

    public boolean removeFromCart(Long productId, ShopUser user, int quantity) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isPresent()) {
            Optional<Transaction> optCart = transactionRepository.findCart(user);
            if (optCart.isPresent()) {
                Product product = optionalProduct.get();
                Transaction cart = optCart.get();
                int freq = Collections.frequency(cart.getProducts(), product);
                if(freq > quantity) {
                    for(int i=0; i<quantity; i++) {
                        cart.getProducts().remove(product);
                    }
                    updateAndSave(cart);
                    return true;
                } else if(freq == quantity) {
                    return removeAllFromCart(productId, user);
                }
            }
        }
        return false;
    }

    public boolean removeAllFromCart(Long productId, ShopUser user) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isPresent()) {
            Optional<Transaction> optCart = transactionRepository.findCart(user);
            if (optCart.isPresent()) {
                Product product = optionalProduct.get();
                Transaction cart = optCart.get();
                while (cart.getProducts().contains(product)) {
                    cart.getProducts().remove(product);
                }
                updateAndSave(cart);
                return true;
            }
        }
        return false;
    }

    public boolean removeCouponFromCart(ShopUser user) {
        Optional<Transaction> optionalCart = transactionRepository.findCart(user);
        if(optionalCart.isPresent()) {
            Transaction cart = optionalCart.get();
            if(cart.getUsedCoupon() != null){
                cart.setUsedCoupon(null);
                updateAndSave(cart);
                return true;
            }
        }
        return false;
    }

    public void emptyCart(ShopUser user) {
        Optional<Transaction> optCart = transactionRepository.findCart(user);
        if (optCart.isPresent()) {
            transactionRepository.delete(optCart.get());
        }
        //transactionRepository.save(new Transaction("CART", user, null, getCurrentDate(), new ArrayList<>()));
    }

    public boolean addToWishlist(Long productId, ShopUser user) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isPresent()){
            Product product = optionalProduct.get();
            Optional<Transaction> optionalTransaction = transactionRepository.findWishlist(user);
            Transaction wishlist;
            if (optionalTransaction.isPresent()) {
                wishlist = optionalTransaction.get();
            } else {
                wishlist = new Transaction("WISHLIST", user, null, getCurrentDate(), new ArrayList<>());
            }
            if (!wishlist.getProducts().contains(product)) {
                wishlist.getProducts().add(product);
                updateAndSave(wishlist);
            }
            return true;
        }
        return false;
    }

    public boolean removeFromWishlist(Long productId, ShopUser user) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isPresent()) {
            Optional<Transaction> optWishlist = transactionRepository.findWishlist(user);
            if (optWishlist.isPresent()) {
                Product product = optionalProduct.get();
                Transaction wishlist = optWishlist.get();
                boolean contained = wishlist.getProducts().contains(product);
                if(contained) {
                    while (contained) {
                        wishlist.getProducts().remove(product);
                        contained = wishlist.getProducts().contains(product);
                    }
                    updateAndSave(wishlist);
                    return true;
                }
            }
        }
        return false;
    }

    public boolean removeFromWishlist(String productName, ShopUser user) {

        Page<Product> products = productRepository.findByName(productName, PageRequest.of(0, 10));
        Optional<Transaction> optWishlist = transactionRepository.findWishlist(user);
        if (optWishlist.isPresent()) {
            Transaction wishlist = optWishlist.get();
            for(Product product: products) {
                boolean contained = wishlist.getProducts().contains(product);
                if(contained) {
                    while (contained) {
                        wishlist.getProducts().remove(product);
                        contained = wishlist.getProducts().contains(product);
                    }
                    updateAndSave(wishlist);
                    return true;
                }
            }
        }
        return false;
    }

    public void emptyWishlist(ShopUser user) {
        Optional<Transaction> optWishlist = transactionRepository.findWishlist(user);
        if (optWishlist.isPresent()) {
            transactionRepository.delete(optWishlist.get());
        }
    }

    public List<StaticDTO> getStatics() {
        return transactionRepository.getStatics();
    }

    public Page<Transaction> findAll(Pageable page) {
        return transactionRepository.findAll(page);
    }

}
