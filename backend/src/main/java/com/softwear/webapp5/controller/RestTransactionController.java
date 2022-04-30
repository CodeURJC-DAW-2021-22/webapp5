package com.softwear.webapp5.controller;

import java.net.URI;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import com.softwear.webapp5.data.TransactionView;
import com.softwear.webapp5.model.Coupon;
import com.softwear.webapp5.model.Product;
import com.softwear.webapp5.model.ShopUser;
import com.softwear.webapp5.model.Transaction;
import com.softwear.webapp5.repository.CouponRepository;
import com.softwear.webapp5.repository.ProductRepository;
import com.softwear.webapp5.repository.UserRepository;
import com.softwear.webapp5.service.MailService;
import com.softwear.webapp5.service.ProductService;
import com.softwear.webapp5.service.TransactionService;
import com.softwear.webapp5.service.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api")
public class RestTransactionController {

    @Autowired
    MailService mailService;
    @Autowired
    TransactionService transactionService;
    @Autowired
    ProductService productService;
    @Autowired
    UserService userService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ProductRepository productRepository;
    @Autowired
    CouponRepository couponRepository;

    @GetMapping("/transactions/{id}") //GET
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id){
        Optional<Transaction> oTrans = transactionService.findById(id);
        if(oTrans.isPresent())
            return ResponseEntity.ok(oTrans.get());
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/transactions") //GET
    public ResponseEntity<List<Transaction>> getTransactions(@RequestParam(required = false) Integer page){
        if(page == null)
            return ResponseEntity.ok(transactionService.findAll());
        
        if(page < 1)
            return ResponseEntity.badRequest().build();
        List<Transaction> listTrans = transactionService.findAll(PageRequest.of(page - 1, 3)).toList();
        return ResponseEntity.ok(listTrans);
    }

    @GetMapping("/transactions/carts") //GET
    public ResponseEntity<List<Transaction>> getCarts(@RequestParam(required = false) Integer page){
        List<Transaction> listTrans = getTransaction("CART", page);
        if(listTrans == null)
            return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(listTrans);
    }

    @GetMapping("/transactions/wishlists") //GET
    public ResponseEntity<List<Transaction>> getWishlists(@RequestParam(required = false) Integer page){
        List<Transaction> listTrans = getTransaction("WISHLIST", page);
        if(listTrans == null)
            return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(listTrans);
    }

    @GetMapping("/transactions/processed") //GET
    public ResponseEntity<List<Transaction>> getProcessed(@RequestParam(required = false) Integer page){
        List<Transaction> listTrans = getTransaction("PROCESSED", page);
        if(listTrans == null)
            return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(listTrans);
    }

    @PostMapping("/transactions") //ADD cart, wishlist or processed transaction
    public ResponseEntity<Transaction> addTransaction(@RequestBody Transaction transaction){
        Transaction newTransaction;
        ShopUser user;
        List<Product> products = new ArrayList<>();
        if(transaction != null){
            newTransaction = new Transaction();
            //We get the users by id
            user = getDbUserFromIdUserInTransaction(transaction);
            if(user == null)
                return ResponseEntity.notFound().build();
            else
                newTransaction.setUser(user);

            //We get the products by id
            products = getDbProductsFromIdProductsInTransaction(transaction);
            if(products == null)
                return ResponseEntity.notFound().build();
            else
                newTransaction.setProducts(products);

            //We get the coupon by id
            newTransaction.setUsedCoupon(getDbCouponFromIdCouponInTransaction(transaction));

            newTransaction.setType(transaction.getType());
            newTransaction.setDate(transaction.getDate());
        
            transactionService.save(newTransaction);
        }
        else //Cant save null transactions (many fields not nullables)
            return ResponseEntity.badRequest().build();
        transactionService.save(newTransaction);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(newTransaction.getId()).toUri();
        return ResponseEntity.created(location).body(newTransaction);
    }

    @PostMapping("/transactions/{transactionId}/products/{productId}") //ADD product to transaction
    public ResponseEntity<Transaction> addProductToTransaction(@PathVariable(value = "transactionId") Long transactionId, @PathVariable(value = "productId") Long productId){
        Optional<Transaction> oTransaction = transactionService.findById(transactionId);
        Optional<Product> oProd = productService.findById(productId);
        if(oTransaction.isPresent() && oProd.isPresent()){
            Transaction transaction = oTransaction.get();
            Product product = oProd.get();
            transaction.getProducts().add(product);
            transactionService.save(transaction);
            URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(transaction.getId()).toUri();
            return ResponseEntity.created(location).body(transaction);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/transactions/{transactionId}/products/{productId}") //DELETE product from transaction
    public ResponseEntity<Product> deleteProductFromTransaction(@PathVariable(value = "transactionId") Long transactionId, @PathVariable(value = "productId") Long productId){
        Optional<Transaction> oTransaction = transactionService.findById(transactionId);
        Optional<Product> oProd = productService.findById(productId);
        if(oTransaction.isPresent() && oProd.isPresent()){
            Transaction transaction = oTransaction.get();
            Product product = oProd.get();
            if(transaction.getProducts().contains(product))
                transaction.getProducts().remove(product);
            else
                ResponseEntity.notFound().build();
            transactionService.save(transaction);
            return ResponseEntity.ok(product);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/transactions/{id}") //EDIT (overwrite transaction)
    public ResponseEntity<Transaction> editTransaction(@PathVariable(value = "id") Long id, @RequestBody Transaction transaction){ //"Cannot construct instance of ShopUser" https://localhost:8443/api/transaction/12?type=WISHLIST&user=1&date=10/1/2034&totalPrice=&products=2
        Optional<Transaction> oNewTransaction = transactionService.findById(id);
        ShopUser user;
        List<Product> products = new ArrayList<>();

        if(oNewTransaction.isPresent()){
            Transaction newTransaction = oNewTransaction.get();

            //We get the users by id
            user = getDbUserFromIdUserInTransaction(transaction);
            if(user == null)
                return ResponseEntity.notFound().build();
            else
                newTransaction.setUser(user);

            //We get the products by id
            products = getDbProductsFromIdProductsInTransaction(transaction);
            if(products == null)
                return ResponseEntity.notFound().build();
            else
                newTransaction.setProducts(products);

            //We get the coupon by id
            newTransaction.setUsedCoupon(getDbCouponFromIdCouponInTransaction(transaction));

            newTransaction.setType(transaction.getType());
            newTransaction.setDate(transaction.getDate());
        
            transactionService.save(newTransaction);
            return ResponseEntity.ok(newTransaction);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/transactions/{id}") //DELETE
    public ResponseEntity<Transaction> removeTransaction(@PathVariable(value = "id") Long id){
        Optional<Transaction> oTransaction = transactionService.findById(id);
        if(oTransaction.isPresent()){
            Transaction transaction = oTransaction.get();
            ResponseEntity<Transaction> response = ResponseEntity.ok(transaction);
            Logger log = LoggerFactory.getLogger(SampleLogController.class);
            log.info(transaction.getId().toString());
            transactionService.delete(transaction);
            //Fails when trying to return transaction
            return response;
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/transactions/cart/me")
    public ResponseEntity<Transaction> getCart(Model model) {
        Optional<ShopUser> oUser = userService.findByUsername((String) model.getAttribute("username"));
        if(oUser.isPresent()) {
            ShopUser user = oUser.get();
            Optional<Transaction> oCart = transactionService.findCart(user);
            if(oCart.isPresent()) {
                return ResponseEntity.ok(oCart.get());
            }
            Transaction cart = new Transaction("CART", user, null, TransactionService.getCurrentDate(), new ArrayList<>());
            transactionService.save(cart);
            return ResponseEntity.ok(cart);
        }
        return ResponseEntity.status(403).build();
    }

    @PutMapping("/transactions/cart/me")
    public ResponseEntity<Transaction> purchaseCart(Model model, @RequestBody Transaction cart) {
        Optional<ShopUser> oUser = userService.findByUsername((String) model.getAttribute("username"));
        
        if(!oUser.isPresent()) return ResponseEntity.status(403).build();
        if(cart.getProducts().isEmpty()) return ResponseEntity.badRequest().build();

        TransactionView cartView = new TransactionView(cart);
        for(TransactionView.TransactionViewEntry entry: cartView.getTransactionEntries()) {
            if(!productService.checkStock(entry.getProduct(), entry.getQuantity())) {
                return ResponseEntity.badRequest().build();
            }
        }
        
        for(TransactionView.TransactionViewEntry entry: cartView.getTransactionEntries()) {
            productService.deleteStock(entry.getProduct(), entry.getQuantity());
        }
        cart.setType("PAID");
        cart.setDate(TransactionService.getCurrentDate());
        transactionService.save(cart);
        mailService.sendPurchaseMail(cart);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/transactions/cart/me")
    public ResponseEntity<Transaction> emptyCart(Model model) {
        Optional<ShopUser> oUser = userService.findByUsername((String) model.getAttribute("username"));
        if(oUser.isPresent()) {
            ShopUser user = oUser.get();
            Optional<Transaction> oCart = transactionService.findCart(user);
            transactionService.emptyCart(user);
            if(oCart.isPresent()) {
                return ResponseEntity.ok(oCart.get());
            }
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.status(403).build();
    }

    @PostMapping("/transactions/cart/me/products/{productId}")
    public ResponseEntity<Transaction> addProductToCart(Model model, @PathVariable Long productId, @RequestParam(required = false) Integer quantity) {
        Optional<ShopUser> oUser = userService.findByUsername((String) model.getAttribute("username"));
        if(oUser.isPresent()) {
            Optional<Product> oProduct = productService.findById(productId);
            if(oProduct.isPresent()) {
                ShopUser user = oUser.get();
                if(quantity == null) quantity = 1;
                transactionService.addToCart(productId, user, quantity);
                return ResponseEntity.ok(transactionService.findCart(user).get());
            }
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.status(403).build();
    }

    @DeleteMapping("/transactions/cart/me/products/{productId}")
    public ResponseEntity<Transaction> removeProductFromCart(Model model, @PathVariable Long productId, @RequestParam(required = false) Boolean all, @RequestParam(required = false) Integer quantity) {
        Optional<ShopUser> oUser = userService.findByUsername((String) model.getAttribute("username"));
        if(oUser.isPresent()) {
            Optional<Product> oProduct = productService.findById(productId);
            if(oProduct.isPresent()) {
                ShopUser user = oUser.get();
                if(all != null && all) {
                    transactionService.removeAllFromCart(productId, user);
                } else {
                    if(quantity == null) {
                        quantity = 1;
                    }
                    transactionService.removeFromCart(productId, user, quantity);
                }
                return ResponseEntity.ok(transactionService.findCart(user).get());
            }
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.status(403).build();
    }

    @GetMapping("/transactions/cart/me/size")
    public ResponseEntity<Integer> cartSize(Model model) {
        Optional<ShopUser> oUser = userService.findByUsername((String) model.getAttribute("username"));
        if(oUser.isPresent()) {
            ShopUser user = oUser.get();
            Optional<Transaction> oCart = transactionService.findCart(user);
            transactionService.emptyCart(user);
            if(oCart.isPresent()) {
                return ResponseEntity.ok(oCart.get().getProducts().size());
            }
        }
        return ResponseEntity.ok(0);
    }

    @GetMapping("/transactions/wishlist/me")
    public ResponseEntity<Transaction> getWishlist(Model model) {
        Optional<ShopUser> oUser = userService.findByUsername((String) model.getAttribute("username"));
        if(oUser.isPresent()) {
            Optional<Transaction> oWishlist = transactionService.findWishlist(oUser.get());
            if(oWishlist.isPresent()) {
                return ResponseEntity.ok(oWishlist.get());
            }
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.status(403).build();
    }

    @PostMapping("/transactions/wishlist/me/products/{productId}")
    public ResponseEntity<Transaction> addProductToWishlist(Model model, @PathVariable Long productId) {
        Optional<ShopUser> oUser = userService.findByUsername((String) model.getAttribute("username"));
        if(oUser.isPresent()) {
            Optional<Product> oProduct = productService.findById(productId);
            if(oProduct.isPresent()) {
                ShopUser user = oUser.get();
                transactionService.addToWishlist(productId, user);
                return ResponseEntity.ok(transactionService.findWishlist(user).get());
            }
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.status(403).build();
    }

    @DeleteMapping("/transactions/wishlist/me/products/{productId}")
    public ResponseEntity<Transaction> removeProductFromWishlist(Model model, @PathVariable Long productId) {
        Optional<ShopUser> oUser = userService.findByUsername((String) model.getAttribute("username"));
        if(oUser.isPresent()) {
            Optional<Product> oProduct = productService.findById(productId);
            if(oProduct.isPresent()) {
                ShopUser user = oUser.get();
                transactionService.removeFromWishlist(productId, user);
                return ResponseEntity.ok(transactionService.findWishlist(user).get());
            }
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.status(403).build();
    }

    @DeleteMapping("/transactions/wishlist/me")
    public ResponseEntity<Transaction> emptyWishlist(Model model) {
        Optional<ShopUser> oUser = userService.findByUsername((String) model.getAttribute("username"));
        if(oUser.isPresent()) {
            ShopUser user = oUser.get();
            transactionService.emptyWishlist(user);
            Optional<Transaction> oWishlist = transactionService.findWishlist(user);
            if(oWishlist.isPresent()) {
                return ResponseEntity.ok(oWishlist.get());
            }
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.status(403).build();
    }
    
    @GetMapping("/transactions/purchaseHistory/me")
    public ResponseEntity<List<Transaction>> getPurchaseHistory(Model model, @RequestParam(required=false) Integer page){
        Optional<ShopUser> oUser = userService.findByUsername((String) model.getAttribute("username"));
        if(oUser.isPresent()) {
    	    if(page!=null) {
	    	    if(page>0) {
                    List<Transaction> transactions = new ArrayList<>();
	                for(Transaction transaction: transactionService.findPurchaseHistory(oUser.get(), PageRequest.of(page-1, 10))) {
	                    transactions.add(transaction);
                    }
                    return ResponseEntity.ok(transactions);
                }
    	    }
		    return ResponseEntity.ok(transactionService.findPurchaseHistory(oUser.get()));
        }
        return ResponseEntity.status(403).build();
    }
    
    @GetMapping("/transactions/purchaseHistory/me/maxPages")
    public ResponseEntity<Integer> getPurchaseHistoryMaxPages(Model model){
        Optional<ShopUser> oUser = userService.findByUsername((String) model.getAttribute("username"));
        if(oUser.isPresent())
		    return ResponseEntity.ok(transactionService.findPurchaseHistory(oUser.get(), PageRequest.of(0, 10)).getTotalPages());
        return ResponseEntity.status(403).build();
    }

    private ShopUser getDbUserFromIdUserInTransaction(Transaction transaction) {
        try{ //If its null it throws an exception, if it's not and it exists we return it
            Optional<ShopUser> oUser = userRepository.findById(transaction.getUser().getId());
            if(oUser.isPresent()){
                return oUser.get();
            }else{
                return null;
            }
        }catch(Exception e){
            return null;
        }
    }

    private List<Product> getDbProductsFromIdProductsInTransaction(Transaction transaction) {
        List<Product> products = new ArrayList<>();
        List<Product> auxProducts = new ArrayList<>();
        auxProducts = transaction.getProducts();
        for(Product prod : auxProducts){
            Optional<Product> oProd = productRepository.findById(prod.getId());
            if(oProd.isPresent()){
                products.add(oProd.get());
            }
        }
        return products;
    }

    private Coupon getDbCouponFromIdCouponInTransaction(Transaction transaction) {
        Coupon coupon;
        try{ //If its null it throws an exception, if it's not and it exists we return it
                Optional<Coupon> oCoupon = couponRepository.findById(transaction.getUsedCoupon().getId());
                if(oCoupon.isPresent()){
                    coupon = oCoupon.get();
                    return coupon;
                }
            }catch(Exception e){
            }
        return null;
    }

    private List<Transaction> getTransaction(String type, Integer page) {
        if(page != null){
            if(page < 1)
                return null;
            return transactionService.findByType(type.toUpperCase(), PageRequest.of(page - 1, 10)).toList();
        }
        return transactionService.findByType(type.toUpperCase());
    }
    
    
}