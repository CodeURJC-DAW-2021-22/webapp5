package com.softwear.webapp5.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

import com.softwear.webapp5.data.ProductSize;
import com.softwear.webapp5.model.Product;

public interface ProductRepository extends JpaRepository <Product, Long> {

    public Page<Product> findByName(String name, Pageable page);
    public Page<Product> findByDescription(String description, Pageable page);
    public Page<Product> findByPrice(double price, Pageable page);
    public Page<Product> findByStock(Long stock, Pageable page);
    public Page<Product> findBySize(ProductSize size, Pageable page);
    Optional<Product> findByNameAndSize(String name, ProductSize size);

    @Query(value = "SELECT DISTINCT size FROM Product WHERE name = :name AND stock <> 0", nativeQuery = true)
    public List<ProductSize> FindSizeAvailableByName(@Param("name") String name);
    
    @Query(value="SELECT product.id " +
            "FROM product left JOIN transaction_products " +
            "on product.id = products_id " +
            "group by product.id " +
            "order by count(products_id) asc " +
            "limit :num ",
            nativeQuery = true)           
    List<Long> getLeastBoughtProducts(@Param("num") int num);

    @Query(value=
            "SELECT DISTINCT ON (NAME) * "
              + "FROM PRODUCT",
            nativeQuery = true)
    Page<Product> findAllNames(Pageable page);

    @Query(value=
            "SELECT DISTINCT ON (NAME) * "
            + "FROM PRODUCT",
            nativeQuery = true)
    public List<Product> findAllNames();
    @Query(value=
            "SELECT * "
            + "FROM PRODUCT WHERE SIZE=:productSize",
            nativeQuery = true)
    public Optional<Product> findBySize(ProductSize productSize);

    @Query(value=
            "SELECT * "
            + "FROM PRODUCT WHERE SIZE=:size and NAME=:name",
            nativeQuery = true)
    public Page<Product> findByNameAndSize(String name, ProductSize size, Pageable page);

    @Query(value=
            "SELECT * "
            + "FROM PRODUCT WHERE NAME=:name",
            nativeQuery = true)
    public Optional<List<Product>> findByName(String name);

//    @Query(value = "SELECT * FROM product WHERE name = :name ORDER BY id ASC LIMIT 1", nativeQuery = true)
//    Optional<Product> findOneName(@Param("name") String name);
}
