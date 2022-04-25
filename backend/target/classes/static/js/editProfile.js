function updateInfo() {
	var dataObj = {
			id: "",
            username: "",
            password: "",
            email: $("#inputEmailAddress")[0].value,
            name: $("#inputFirstName")[0].value,
            lastName: $("#inputLastName")[0].value,
            address: $("#inputAddress")[0].value,
            mobileNumber: $("#inputPhone")[0].value,
            birthdate: $("#inputBirthdate")[0].value,
            role: ""
	};
	console.log(JSON.stringify(dataObj));
    $.ajax({
        url: "/api/users/updateUserInfo",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(dataObj),
        success: function(result) {
			       	 success_alert();
			       	 closeFormChangePassword();
			       },
			       error: function(result){
			       	error_alert();
			       	closeFormChangePassword();
			       }
    })
}

function updatePass() {
	var dataObj = {
            oldPass: $("#floatingPasswordOld")[0].value,
            newPass: $("#floatingPasswordNew")[0].value,
            newConfPass: $("#floatingPasswordNewRepeat")[0].value
            
	};
	console.log(JSON.stringify(dataObj))
    $.ajax({
        url: "/api/users/updatePassword",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(dataObj),
        success: function(result) {
        	 success_alert();
        	 closeFormChangePassword();
        	 $("#floatingPasswordOld")[0].value="";
        	 $("#floatingPasswordNewRepeat")[0].value="";
         	 $("#floatingPasswordNew")[0].value="";
        },
        error: function(result){
        	error_alert();
        	closeFormChangePassword();
        	$("#floatingPasswordOld")[0].value="";
        	$("#floatingPasswordNewRepeat")[0].value="";
        	$("#floatingPasswordNew")[0].value="";
        }
    })
}

function openFormChangePassword() {
    document.getElementById("change-password-form").style.display = "block";
}
    
function closeFormChangePassword() {
    document.getElementById("change-password-form").style.display = "none";
}

function success_alert(){
    $('#formBox').prepend('<div class="alert alert-success" role="alert" id="success-alert"> Operation succeded! </div>');
    setTimeout(function() {
        $('#success-alert').remove();
      }, 3000);
}

function error_alert(){
    $('#formBox').prepend('<div class="alert alert-danger" role="alert" id="error-alert"> Operation failed! </div>');
    setTimeout(function() {
        $('#error-alert').remove();
      }, 3000);
}