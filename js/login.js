$(document).ready(function () {

  setCookie('access_token', '', { expires : 0 });

  $("#inputName").val(getCookie("email"))

  $("#but").on("click", function () {
    $("#inputName").removeClass('input-error')
    $("#password").removeClass('input-error')
    var email = document.getElementById('inputName').value;
    var password = document.getElementById('password').value;
    $.ajax({
      url: address + '/authorization/login',
      type: "POST",
      data:JSON.stringify({
        'email': email,
        'password': password,
        'audience' : 'web',
        'userAgent' : 'userAgent'
      }),
      dataType: "json",
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Content-Type", "application/json");
      },
      success: function(data){
        console.log(data.response.payload.exp);
        setCookie('access_token', data.response.access_token, { expires : data.response.payload.exp });
        data = data.response.payload;
        setCookie('last_name', data.last_name);
        setCookie('first_name', data.first_name);
        setCookie('middle_name', data.middle_name);
        setCookie('authorities', data.authorities[0]);
        setCookie('phone_number', data.phone_number);
        setCookie('email', data.email);
        setCookie('phone', data.phone_number);
        setCookie('id', data.user_id);

        document.location.href = "./events.html";
      },
      error: function(data){
        console.log("Authorization error: ", data);
        $("#inputName").addClass('input-error')
        $("#password").addClass('input-error')
      }
    });
  })
});
