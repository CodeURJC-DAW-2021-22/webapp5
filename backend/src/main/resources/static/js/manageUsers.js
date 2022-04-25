let token = "";
let currentPage = 1;
let maxPages = 0;
const queryString = window.location.search; 	
const urlParams = new URLSearchParams(queryString);
let url = new URL(window.location.href);

function more() {
	currentPage++;
    if(currentPage <= maxPages) {
        $.ajax({
            url: "/api/users/?page=" + (currentPage),
            type: "get",
            dataType: "json"
        }).done(function (users) {
        	for(let i=0; i<users.length; i++) {
        		let user= users[i];
        		$("tbody").append("<tr id=\"user-"+user.id+"\">\r\n"
        				+ "                            <td scope=\"row\" class=\"user-id\">"+user.id+"</td>\r\n"
        				+ "                            <td class=\"user-username\">"+user.username+"</td>\r\n"
        				+ "                            <td class=\"user-email\">"+user.email+"</td>\r\n"
        				+ "                            <td class=\"user-name\">"+user.name+"</td>\r\n"
        				+ "                            <td class=\"user-lastName\">"+user.lastName+"</td>\r\n"
        				+ "                            <td class=\"user-address\">"+user.address+"</td>\r\n"
        				+ "                            <td class=\"user-phone\">"+user.mobileNumber+"</td>\r\n"
        				+ "                            <td class=\"user-birthdate\">"+user.birthdate+"</td>\r\n"
        				+ "                            <td class=\"user-role\">"+user.role+"</td>\r\n"
        				+ "                            <td><button class=\"btn btn-primary\" type=\"button\" data-bs-toggle=\"modal\" data-bs-target=\"#modalAddEditUserData\"\r\n"
        				+ "                                data-id=\""+user.id+"\" onclick=\"edit_user_load($(this).data('id'));\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i></button></td>\r\n"
        				+ "                            <td><button data-id=\""+user.id+"\" onclick=\"deleteUser($(this).data('id'));\" class=\"btn btn-primary\" type=\"button\"><i class=\"fa fa-trash\" aria-hidden=\"true\"></i></button></td>\r\n"
        				+ "                          </tr>")
        	}
        	
            if(currentPage >= maxPages) {
                $("#more-btn").hide();
            }
        });
        
    	window.history.pushState("", "", "?page="+(currentPage));
    }
    return currentPage;
};

function edit_user_load(id){
	$("#saveButton").attr("onclick","updateUser();");

    trSelected = "#user-" + id;
    editUsername = trSelected + " .user-username";
    editEmail = trSelected + " .user-email";
    editName = trSelected + " .user-name";
    editLastName = trSelected + " .user-lastName";
    editAddress = trSelected + " .user-address";
    editPhone = trSelected + " .user-phone";
    editBirthdate = trSelected + " .user-birthdate";
    editRole = trSelected + " .user-role";

    $("#editId").val(id);
    $("#editUserName").val($(editUsername)[0].innerHTML);
    $("#editEmail").val($(editEmail)[0].innerHTML);
    $("#editName").val($(editName)[0].innerHTML);
    $("#editLastName").val($(editLastName)[0].innerHTML);
    $("#editAddress").val($(editAddress)[0].innerHTML);
    $("#editPhone").val($(editPhone)[0].innerHTML);
    $('#editBirthDate').val($(editBirthdate)[0].innerHTML);
    $("#editRole").val($(editRole)[0].innerHTML);

    $("editPassword").attr("required", "false");
};

function updateUser() {
	
	var dataObj = {
			id: $("#editId")[0].defaultValue,
            username: $("#editUserName")[0].value,
            password: $("#editPassword")[0].value,
            email: $("#editEmail")[0].value,
            name: $("#editName")[0].value,
            lastName: $("#editLastName")[0].value,
            address: $("#editAddress")[0].value,
            mobileNumber: $("#editPhone")[0].value,
            birthdate: $("#editBirthDate")[0].value,
            role: $("#editRole")[0].value
	};
    $.ajax({
        url: "/api/users/"+dataObj.id,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(dataObj),
        success: function(result) {
        	 success_alert();
        	 $('#dismiss-modal-users').click();
        	 $("#user-"+dataObj.id+" .user-username").html(dataObj.username);
             $("#user-"+dataObj.id+" .user-email").html(dataObj.email);
             $("#user-"+dataObj.id+" .user-name").html(dataObj.name);
             $("#user-"+dataObj.id+" .user-lastName").html(dataObj.lastName);
             $("#user-"+dataObj.id+" .user-address").html(dataObj.address);
             $("#user-"+dataObj.id+" .user-phone").html(dataObj.mobileNumber);
             $("#user-"+dataObj.id+" .user-birthdate").html(dataObj.birthdate);
             $("#user-"+dataObj.id+" .user-role").html(dataObj.role);
        }
    })
}


function deleteUser(id) {
	$.ajax({
        url: "/api/users/"+id,
        type: "DELETE",
        success: function(result) {
        	 success_alert();
             $("#user-"+id).remove();
        }
    })
}


$('#button-add-user').click(function(){
	$("#saveButton").attr("onclick","addUser();");
    $("editPassword").attr("required", "true");

    $("#editId").val('');
    $("#editPassword").val('');
    $("#editUserName").val('');
    $("#editEmail").val('');
    $("#editName").val('');
    $("#editLastName").val('');
    $("#editAddress").val('');
    $("#editPhone").val('');
    $('#editBirthDate').val('');
    $("#editRole").val('');
});

function addUser() {
	var dataObj = {
            username: $("#editUserName")[0].value,
            password: $("#editPassword")[0].value,
            email: $("#editEmail")[0].value,
            name: $("#editName")[0].value,
            lastName: $("#editLastName")[0].value,
            address: $("#editAddress")[0].value,
            mobileNumber: $("#editPhone")[0].value,
            birthdate: $("#editBirthDate")[0].value,
            role: $("#editRole")[0].value
	};
    $.ajax({
        url: "/api/users/",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(dataObj),
        success: function(result) {
        	 success_alert();
        	 $('#dismiss-modal-users').click();
        	 let addHTML = '<tr id="user-'+result.id+'"> <td scope="row" class="user-id">'+result.id+'</td> <td class="user-username">'+
		                     result.username+'</td>' + '<td class="user-email">'+result.email+'</td> <td class="user-name">'+result.name+'</td>' +
		                     '<td class="user-lastName">'+result.lastName+'</td> <td class="user-address">'+result.address+'</td>' +
		                     '<td class="user-phone">'+result.mobileNumber+'</td> <td class="user-birthdate">'+result.birthdate+'</td>' +
		                     '<td class="user-role">'+result.role+'</td>'+
		                     '<td><button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#modalAddEditUserData" '+
		                     'data-id="'+result.id+'" onclick="edit_user_load('+result.id+');"><i class="fa fa-pencil" aria-hidden="true"></i></button></td>' +
		                     '<td><button data-id="'+result.id+'" onclick="deleteUser('+result.id+');" '+
		                     'class="btn btn-primary" type="button"><i class="fa fa-trash" aria-hidden="true"></i></button></td> </tr>';
             $('tbody').append(addHTML);
        }
    })
}


function success_alert(){
    $('#manage-users-container').prepend('<div class="alert alert-success" role="alert" id="success-alert"> Operation succeded! </div>');
    setTimeout(function() {
        $('#success-alert').remove();
      }, 3000);
}

function error_alert(){
    $('#manage-users-container').prepend('<div class="alert alert-danger" role="alert" id="error-alert"> Operation failed! </div>');
    setTimeout(function() {
        $('#error-alert').remove();
      }, 3000);
}

$(document).ready(function () {
    token = $("#csrf-token").attr("content");
    maxPages = Number($("#max-pages").attr("content"));
    let page= urlParams.get('page');
    if(page!=null) {
    	while((currentPage<page) && (page<=maxPages)) {
    		currentPage=more();
    		
    	}
    }
});