$(document).ready(function () {
  $('#dataInput').append('<div class="data"><div class="fotoAvatar"><img alt="photo.png" id="photoUser"></div><div class="info1"><div class="nameAcc">Фамилия:<div class="infoAcc">' +
    getCookie('last_name') + '</div></div><div class="nameAcc">Имя:<div class="infoAcc">' + getCookie('first_name') + '</div></div><div class="nameAcc">Отчество:<div class="infoAcc">' +
    getCookie('middle_name') +'</div></div></div><div class="info2"><div class="nameAcc">Тип аккаунта:<div class="infoAcc">'+
    getCookie('authorities') + '</div></div><div class="nameAcc">Телефон<div class="infoAcc">'+
    getCookie('phone') +'</div></div><div class="nameAcc">email:<div class="infoAcc">'+getCookie('email')+'</div></div></div></div>');
  $(function () {
    $.ajax({
      url : address + "/user/profile/photo",
      type : "GET",
      dataType : 'binary',
      headers : {
        'Authorization': getCookie('access_token')
      },
      //xhr.setRequestHeader('Authorization', getCookie('access_token'));
      processData : false,
      success : function (data) {
        var url = URL.createObjectURL(data);
        $("#photoUser").attr("src", url);
      }
    });
  })
});

$('#logout-button').click(function(event) {
  event.preventDefault();
  $.ajax({
    url: address + '/authorization/logout',
    type: "GET",
    success: function() {
      console.log("Success logout");
      document.location.href = "login.html";
    },
    error: function() {
      console.log("Fail logout");
      document.location.href = "login.html";
    }
  })
})
