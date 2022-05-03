package com.softwear.webapp5.data;

import com.softwear.webapp5.model.ShopUser;

public class ShopUserView {
	
	private Long id;
	private String username;
	private String email;
	private String name;
	private String lastName;
	private String address;
	private int phoneNumber;
	private String birthDate;
	private String role;
	
	
	public ShopUserView(ShopUser u) {
		this.id=u.getId();
		this.username=u.getUsername();
		this.email=u.getEmail();
		this.name=u.getName();
		this.lastName=u.getLastName();
		this.address=u.getAddress();
		this.phoneNumber= u.getPhoneNumber();
		this.birthDate= u.getBirthDate();
		this.role=u.getRole();
	}
	
	public ShopUserView(Long id, String username, String email, String name, String lastName, String address,
			int phoneNumber, String birthDate, String role) {
		super();
		this.id = id;
		this.username = username;
		this.email = email;
		this.name = name;
		this.lastName = lastName;
		this.address = address;
		this.phoneNumber = phoneNumber;
		this.birthDate = birthDate;
		this.role = role;
	}
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public int getPhoneNumber() {
		return phoneNumber;
	}
	public void setPhoneNumber(int phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
	public String getBirthDate() {
		return birthDate;
	}
	public void setBirthDate(String birthDate) {
		this.birthDate = birthDate;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	
	
}
