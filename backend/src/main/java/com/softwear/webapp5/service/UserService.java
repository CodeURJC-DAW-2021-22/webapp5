package com.softwear.webapp5.service;

import com.softwear.webapp5.repository.UserRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.softwear.webapp5.model.ShopUser;

@Service
public class UserService {
	
	@Autowired
	private UserRepository shopUsers;
	
	public Page<ShopUser> findAll(Pageable page){
		return shopUsers.findAll(page);
	}
	
	public Optional<ShopUser> findById(Long id){
		return shopUsers.findById(id);
	}
	
	public List<ShopUser> findAll(){
		return shopUsers.findAll();
	}

	public Optional<ShopUser> findByUsername(String username){
		return shopUsers.findByUsername(username);
	}
	
	public List<ShopUser> findByEmail (String email){
		return shopUsers.findByEmail(email);
	}
	
	public List<ShopUser> findByName (String name){
		return shopUsers.findByName(name);
	}
	
	public List<ShopUser> findByLastName (String lastName){
		return shopUsers.findByLastName(lastName);
	}
	
	public List<ShopUser> findByAddress (String address){
		return shopUsers.findByAddress(address);
	}
	
	public List<ShopUser> findByBirthdate (String birthdate){
		return shopUsers.findByBirthdate(birthdate);
	}
	
	///////////////////////////////////////////
	
	public void updateInfo(Optional<ShopUser> oldShopUser, ShopUser u) {
		
		
		oldShopUser.get().setAddress(u.getAddress());
		oldShopUser.get().setBirthdate(u.getBirthdate());
		oldShopUser.get().setEmail(u.getEmail());
		oldShopUser.get().setLastName(u.getLastName());
		oldShopUser.get().setMobileNumber(u.getMobileNumber());
		oldShopUser.get().setName(u.getName());
		
		shopUsers.save(oldShopUser.get());
		
	}

	public void updateAdminInfo(ShopUser oldShopUser, ShopUser u, boolean pass) {

		oldShopUser.setUsername(u.getUsername());
		oldShopUser.setAddress(u.getAddress());
		if(pass){
			oldShopUser.setPassword(u.getPassword());
		}
		oldShopUser.setBirthdate(u.getBirthdate());
		oldShopUser.setEmail(u.getEmail());
		oldShopUser.setLastName(u.getLastName());
		oldShopUser.setMobileNumber(u.getMobileNumber());
		oldShopUser.setName(u.getName());
		oldShopUser.setRole(u.getRole());
		
		shopUsers.save(oldShopUser);
		
	}
	
	public void updatePass(Optional<ShopUser> oldShopUser, String newPass) {

		oldShopUser.get().setPassword(newPass);
		shopUsers.save(oldShopUser.get());
		
	}
	
	public void saveUser(ShopUser u) {
		shopUsers.save(u);
	}

	public void delete(Long id){
		shopUsers.deleteById(id);
	}

	public boolean checkShippingData(ShopUser user) {
		return !user.getName().equals("") && !user.getLastName().equals("") && !user.getAddress().equals("");
	}

}
