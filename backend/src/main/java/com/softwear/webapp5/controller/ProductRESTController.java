package com.softwear.webapp5.controller;

import com.softwear.webapp5.data.ProductNoImagesDTO;
import com.softwear.webapp5.data.ProductSize;
import com.softwear.webapp5.model.Product;
import com.softwear.webapp5.service.ProductService;
import org.hibernate.engine.jdbc.BlobProxy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import net.bytebuddy.asm.Advice.Return;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentRequest;

@RestController
@RequestMapping("/api/products")
public class ProductRESTController {

    @Autowired
    private ProductService productService;

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {

        Optional<Product> product = productService.findById(id);

        if (product.isPresent()){
            return ResponseEntity.ok(product.get());
        } else {
            return ResponseEntity.notFound().build();
        } 
    }

    // @GetMapping("/{name}")
    // public ResponseEntity<Page<Product>> getProductsByName(@PathVariable String name, @RequestParam(required = false) PageRequest page) {a
    //     Page<Product> products = productService.findByName(name, page);
    //     return ResponseEntity.ok(products);
    // }

    @GetMapping("")
    public ResponseEntity<List<Product>> getProduct(@RequestParam(required = false) String name, @RequestParam(required = false) String size, 
    @RequestParam(required = false) Boolean isDistinct, @RequestParam(required = false) Integer page){
        List<Product> response = new ArrayList<>();
        if(page == null){
            if(name == null && size == null){
                if(isDistinct == null || !isDistinct){
                    response = productService.findAll();
                }else
                    response = productService.findAllNames();
            }else if(name != null && size != null){
                ProductSize productSize = ProductSize.stringToProductSize(size);
                Optional<Product> product = productService.findByNameAndSize(name, productSize);
                if (product.isPresent()){
                    response.add(product.get());
                }
            }else if(name == null && size != null){
                ProductSize productSize = ProductSize.stringToProductSize(size);
                Optional<Product> product = productService.findBySize(productSize);
                if(product.isPresent())
                    response.add(product.get());
            }else{
                Optional<List<Product>> product = productService.findByName(name);
                if(product.isPresent())
                    response = product.get();
            }
            return ResponseEntity.ok(response);
        }else{
            if(page < 1)
                return ResponseEntity.badRequest().build();
            else{
                if(name == null && size == null){
                    if(isDistinct == null || !isDistinct)
                        response = productService.findAll(PageRequest.of(page - 1, 10)).toList();
                    else
                        response = productService.findAllNames(PageRequest.of(page - 1, 10)).toList();
                }else if(name != null && size != null){
                    ProductSize productSize = ProductSize.stringToProductSize(size);
                    Optional<Product> product = productService.findByNameAndSize(name, productSize);
                    if (product.isPresent()){
                        response.add(product.get());
                    }
                }else if(name == null && size != null){
                    ProductSize productSize = ProductSize.stringToProductSize(size);
                    response = productService.findBySize(productSize, PageRequest.of(page - 1, 10)).toList();
                }else{
                    Optional<List<Product>> product = productService.findByName(name);
                    if(product.isPresent())
                        response = product.get();
                }

                return ResponseEntity.ok(response);
            }
        }
    }

    @GetMapping("/maxPages")
    public ResponseEntity<Integer> getPurchaseHistoryMaxPages(){
		return ResponseEntity.ok(productService.findAll(PageRequest.of(0, 10)).getTotalPages());
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody ProductNoImagesDTO productNoImages) {

        Product product = new Product(productNoImages);
        productService.save(product);

        URI location = fromCurrentRequest().path("/{id}").buildAndExpand(product.getId()).toUri();

        return ResponseEntity.created(location).body(product);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Product> deleteProduct(@PathVariable long id){
        
        Optional<Product> product = productService.findById(id);

        if (product.isPresent()) {
            productService.deleteProduct(id);

            return ResponseEntity.ok(product.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }   

    @PutMapping("/{id}")
    public ResponseEntity<Product> replaceProduct(@PathVariable long id,
            @RequestBody ProductNoImagesDTO newProduct) {

        Optional<Product> product = productService.findById(id);

        if (product.isPresent()) {
            Product updatedProduct = productService.updateProduct(product.get(), newProduct);
            productService.save(updatedProduct);

            return ResponseEntity.ok(updatedProduct);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Transactional
    @GetMapping("/{productId}/image/{imageIndex}")
    public ResponseEntity<Object> getProductImage(@PathVariable Long productId,
            @PathVariable int imageIndex) throws SQLException {

        Product product = productService.findById(productId).orElseThrow();
        List<Blob> images = product.getImageFiles();

        if (product.getImageFiles() != null && images.size() > imageIndex) {
            Blob image = product.getImageFile(imageIndex);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, "image/*")
                    .contentLength(image.length())
                    .body(image.getBytes(1L, (int) image.length()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{productId}/image")
    public ResponseEntity<Object> saveProductImage(@PathVariable Long productId,
                @RequestParam MultipartFile imageFile) throws IOException, URISyntaxException {

        Optional<Product> productOptional = productService.findById(productId);

        if (productOptional.isPresent()){
            Product product = productOptional.get();

            URI currentLocation = fromCurrentRequest().build().toUri();
            String imageIndex = Integer.toString(product.getImages().size());
            URI location = productService.extendURI(currentLocation, imageIndex);

            product.addImage(location.toString());
            product.addImageFile(BlobProxy.generateProxy(imageFile.getInputStream(), imageFile.getSize()));

            productService.save(product);

            return ResponseEntity.created(location).build();

        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{productId}/image/{imageIndex}")
    public ResponseEntity<Object> deleteImage(@PathVariable Long productId,
            @PathVariable int imageIndex) {
        
        Optional<Product> productOptional = productService.findById(productId);

        if (productOptional.isPresent()) {

            List<Product> productsWithSameImages = productService.deleteImage(productOptional.get(), imageIndex);
            for (Product product : productsWithSameImages)
                productService.save(product);

            return ResponseEntity.noContent().build();
        }
            return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{productId}/image")
    public ResponseEntity<Object> deleteAllImage(@PathVariable Long productId) {
        
        Optional<Product> productOptional = productService.findById(productId);

        if (productOptional.isPresent()) {

            List<Product> productsWithSameImages= productService.deleteAllImages(productOptional.get());
            for (Product product : productsWithSameImages)
                productService.save(product);

            return ResponseEntity.noContent().build();
        }
            return ResponseEntity.notFound().build();
    }
}
