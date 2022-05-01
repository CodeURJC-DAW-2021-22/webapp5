package com.softwear.webapp5.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

	@Column(nullable = false)
    private String type;

	@ManyToOne(optional = false,  fetch=FetchType.EAGER)
	@OnDelete(action = OnDeleteAction.CASCADE)
    private ShopUser user;

	@ManyToOne (fetch=FetchType.EAGER)
	@OnDelete (action = OnDeleteAction.NO_ACTION)
    private Coupon usedCoupon;

	@Column(nullable = false)
    private String date;

	@Column(nullable = false)
	private Double totalPrice;

	@ManyToMany(cascade=CascadeType.REMOVE, fetch=FetchType.EAGER)
	@OnDelete(action = OnDeleteAction.CASCADE)
	@LazyCollection(LazyCollectionOption.FALSE)
	@Column(nullable = false)
    private List<Product> products;

	public Transaction(String type, String date) {
		this.type = type;
		this.date = date;
	}

    public Transaction(String type, ShopUser user, Coupon usedCoupon, String date, List<Product> products) {
        this.type = type;
        this.user = user;
        this.usedCoupon = usedCoupon;
        this.date = date;
        this.products = products;
		totalPrice = calculateTotalProductPrice();
    }

    public Transaction() {}

	public Transaction(Transaction tr) {
		this.type = tr.type;
        this.user = tr.user;
        this.usedCoupon = tr.usedCoupon;
        this.date = tr.date;
        this.products = tr.products;
		totalPrice = calculateTotalProductPrice();
    }

    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public ShopUser getUser() {
		return user;
	}

	public void setUser(ShopUser user) {
		this.user = user;
	}

	public Coupon getUsedCoupon() {
		return usedCoupon;
	}

	public void setUsedCoupon(Coupon usedCoupon) {
		this.usedCoupon = usedCoupon;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public List<Product> getProducts() {
		return products;
	}

	public void setProducts(List<Product> products) {
		this.products = products;
		totalPrice = calculateTotalProductPrice();
	}

	public Double getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(Double totalPrice) {
		this.totalPrice = totalPrice;
	}

	// Returns sum of product prices, without discount
    public double calculateTotalProductPrice() {
		double sum = 0.0f;
		for(Product product: products) {
			sum += product.getPrice();
		}
		return sum;
	}

}