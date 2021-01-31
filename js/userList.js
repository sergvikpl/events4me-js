$(document).ready(function () {

    $.ajax({
        url: address + '/event/registrations?eventId=' + sessionStorage.getItem('currentConf'),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', getCookie('access_token'));
            xhr.setRequestHeader("Content-Type", "application/json");
        },
        success: function (result) {
            result = result.response;
            console.log(result);
            if (result.length == 0) {
                $('#userData').append('<tr>' +
                    '<td colspan="5" style="text-align: center">зарегистрированные пользователи отсутствуют</td>' +
                    '</tr>');
            }

            for (i in result) {
                var visit = "";
                // console.log(result[i].visited);
                if (result[i].visited === true) {
                    visit = "<img src='../../img/checked.png'/>"
                } else {
                    visit = " ";
                }
                $('#userData').append('<tr class="uBox" id = "' + result[i].user.id + '">' +
                    '<td>' + result[i].user.lastName + '</td>' +
                    '<td>' + result[i].user.firstName + '</td>' +
                    '<td>' + result[i].user.middleName + '</td>' +
                    '<td> - </td>' +
                    '<td class="col5">' + visit + '</td>' +
                    '</tr>');
                sessionStorage.setItem('user_id='+ result[i].user.id, JSON.stringify(result[i]));

                searchUsers();
            }
            $("#tableUsers .uBox").click(function () {
                sessionStorage.setItem('user_id', this.id);
                document.location.href = "./users/user.html";
            });
        },
        error: function (data) {
            console.log(data);
        }
    });

});


function searchUsers() {
    var $rows = $('#userData tr');
    $('#searchUser').keyup(function () {
        var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase().split(' ');

        $rows.hide().filter(function () {
            var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
            var matchesSearch = true;
            $(val).each(function (index, value) {
                matchesSearch = (!matchesSearch) ? false : ~text.indexOf(value);
            });
            return matchesSearch;
        }).show();
    });
}
