package com.softwear.webapp5.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softwear.webapp5.model.Product;

public interface ProductRepository extends JpaRepository <Product, Long> {
    

}
