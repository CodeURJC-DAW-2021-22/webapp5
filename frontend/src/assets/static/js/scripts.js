$(document).ready(function() {   
    
});

function signIn() {
	var dataObj = {
            username: $("#floatingUsername")[0].value,
            password: $("#floatingPassword")[0].value
	};
    $.ajax({
        url: "/api/auth/login",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(dataObj),
        success: function(result) {
        }
    })
}



function logOut() {
	$.ajax({
        url: "/api/auth/logout",
        type: "POST",
        contentType: "application/json",
        data: {
        	
        },
        success: function(result) {
        }
    })
	
}


function register() {
	
	if($("#floatingPasswordReg")[0].value == $("#floatingPasswordRepeatReg")[0].value) {
		var dataObj = {
				id: "",
	            username: $("#floatingUsernameReg")[0].value,
	            password: $("#floatingPasswordReg")[0].value,
	            email: $("#floatingEmailReg")[0].value,
	            name: "",
	            lastName: "",
	            address: "",
	            mobileNumber: 0,
	            birthdate: "",
	            role: "USER"
		};
		console.log(JSON.stringify(dataObj))
	    $.ajax({
	        url: "/api/users/createUser",
	        type: "POST",
	        contentType: "application/json",
	        data: JSON.stringify(dataObj),
	        success: function(result) {
	        	
	        }
	    })
	}
}