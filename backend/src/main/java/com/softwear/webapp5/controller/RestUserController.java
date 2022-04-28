package com.softwear.webapp5.controller;

import java.net.URI;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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

import com.softwear.webapp5.data.PassChange;
import com.softwear.webapp5.data.ShopUserView;
import com.softwear.webapp5.model.ShopUser;
import com.softwear.webapp5.security.jwt.UserLoginService;
import com.softwear.webapp5.service.UserService;

@RestController
@RequestMapping("/api/users")
public class RestUserController {

	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private UserService userService;

	@Autowired
	private UserLoginService userLogService;
	
	@GetMapping("/me")
	public ResponseEntity<ShopUser> me(HttpServletRequest request) {
		
		Principal principal = request.getUserPrincipal();

		if(principal != null) {
			return ResponseEntity.ok(userService.findByUsername(principal.getName()).orElseThrow());
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@GetMapping("/")
	public ResponseEntity<List<ShopUser>> get(@RequestParam(required=false) Integer page) {
		if(page!=null) {
			if(page>0) {
				List<ShopUser> listUser= new ArrayList<>();
		        for(ShopUser u: userService.findAll(PageRequest.of(page-1, 1))) {
		        	listUser.add(u);
		        }
		        return ResponseEntity.ok(listUser);
			}
		}
		return ResponseEntity.ok(userService.findAll());
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<ShopUser> updateAdmin(@RequestBody ShopUser u, @PathVariable Long id) {
		u.setPassword(passwordEncoder.encode(u.getPassword()));
		Optional<ShopUser> oldUser = userService.findById(id);
		
		if(oldUser.isPresent()) {
			userService.updateAdminInfo(oldUser.get(), u);
			return ResponseEntity.ok(oldUser.get());
		}
		return ResponseEntity.notFound().build();
	}
	
	@PutMapping("/userInfo")
	public ResponseEntity<ShopUser> updateUser(HttpServletRequest request, @RequestBody ShopUser u) {
		Optional<ShopUser> oldUser = userService.findByUsername(request.getUserPrincipal().getName());
	
		userService.updateInfo(oldUser, u);
		return ResponseEntity.ok(oldUser.get());
	}
	
	@PutMapping("/password")
	public ResponseEntity<ShopUser> updateUserPass(HttpServletRequest request, @RequestBody PassChange pc) {
		Optional<ShopUser> oldUser= userService.findByUsername(request.getUserPrincipal().getName());
		
		if(passwordEncoder.matches(pc.getOldPass(), oldUser.get().getPassword()) && pc.getNewPass().equals(pc.getNewConfPass())) {
			userService.updatePass(oldUser, passwordEncoder.encode(pc.getNewPass())	);
			return ResponseEntity.ok().build();
		}
		
		return ResponseEntity.badRequest().build();
		
	}
	
	@PostMapping("/")
	public ResponseEntity<ShopUserView> create(@RequestBody ShopUser u) {
		u.setPassword(passwordEncoder.encode(u.getPassword()));
		userService.saveUser(u);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(u.getId()).toUri();
		return ResponseEntity.created(location).body(new ShopUserView(u));
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<ShopUser> delete(@PathVariable Long id) {
		Optional<ShopUser> user = userService.findById(id); 
		if(user.isPresent()) {
			userService.delete(id);
			return ResponseEntity.ok(user.get());
		}
		
		return ResponseEntity.notFound().build();
	}
}
