package com.softwear.webapp5.model;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="Users")
public class ShopUser {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(unique=true, nullable = false)
	private String username;
	
	@Column(unique=true, nullable = false)
	private String email;
	private String name;
	private String lastName;
	@Column(nullable = false)
	private String password;
	private String address;
	
	@Column(unique=true)
	private int mobileNumber;
	private String birthdate;
	@Column(nullable = false)
	private String role;
	
	
	public ShopUser() {
	
	}

		

	public ShopUser(String username, String email, String name, String lastName, String password, String address,
			int mobileNumber, String birthdate, String role) {
		this.username = username;
		this.email = email;
		this.name = name;
		this.lastName = lastName;
		this.password = password;
		this.address = address;
		this.mobileNumber = mobileNumber;
		this.birthdate = birthdate;
		this.setRole(role);
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


	public String getPassword() {
		return password;
	}


	public void setPassword(String password) {
		this.password = password;
	}


	public String getAddress() {
		return address;
	}


	public void setAddress(String address) {
		this.address = address;
	}


	public int getMobileNumber() {
		return mobileNumber;
	}


	public void setMobileNumber(int mobileNumber) {
		this.mobileNumber = mobileNumber;
	}


	public String getBirthdate() {
		return birthdate;
	}


	public void setBirthdate(String birthdate) {
		this.birthdate = birthdate;
	}



	public String getRole() {
		return role;
	}



	public void setRole(String role) {
		this.role = role;
	}

	
		
}
