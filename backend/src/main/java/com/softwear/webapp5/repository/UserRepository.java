package com.softwear.webapp5.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.softwear.webapp5.model.ShopUser;

public interface  UserRepository extends JpaRepository<ShopUser, Long> {
	
	@Query(value ="SELECT u.* "+
	"FROM Users u "+
	"order by u.id asc",
	nativeQuery = true)
	public Page<ShopUser> findAll(Pageable page);
	@Query(value ="SELECT u.* "+
	"FROM Users u "+
	"order by u.id asc",
	nativeQuery = true)
	public List<ShopUser> findAll();
	public Optional<ShopUser> findById(Long id);
	public Optional<ShopUser> findByUsername(String username);
	public List<ShopUser> findByEmail (String email);
	public List<ShopUser> findByName (String name);
	public List<ShopUser> findByLastName (String lastName);
	public List<ShopUser> findByAddress (String Address);
	public List<ShopUser> findByBirthDate (String birthDate);
	
}
