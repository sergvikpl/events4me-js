$(document).ready(function () {
    sessionStorage.removeItem('addressConf');
    sessionStorage.removeItem('coords');
    // ========================
    $.ajax({
        url: address + '/event/all',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', getCookie('access_token'));
        },
        success: function (resault) {
            // console.log(resault);
            resault = resault.response;
            sessionStorage.setItem("conf_list", JSON.stringify(resault));
            for (iter in resault) {
                var dateStart = $.format.date(resault[iter].dateStart, "dd MMM yyyy H:mm");
                var dateEnd = $.format.date(resault[iter].dateEnd, "dd MMM yyyy H:mm");
// Отрисовка части таблицы и заполнение данными
                $('#eventsData').append('<tr class="evBox" id = "' + resault[iter].id + '">' +
                    '<td>' + resault[iter].name + '</td>' +
                    '<td>' + dateStart + ' - ' + dateEnd + '</td>' +
                    '<td>' + resault[iter].address + '</td>' +
                    '<td>' + resault[iter].organizations[0].name + '<img class="trashConf" onclick="event.stopPropagation()"  src="../img/delete.png" id="' + resault[iter].id + ' " width=20px></td>' +
                    '<td class="timestamp">' + resault[iter].dateStart + '-' + resault[iter].dateEnd + '</td>' +
                    '</tr>');
                gotoEvent();
                searchConf();
            }
// Удаление записи (конференции)
            $(".trashConf").click(function () {
                trashConf(this.id);
            });
//////////////////////////////
            $("#todaysConf").click(function (){
                todaysConf();
            });
// Отображение сегодняшних и всех конференций
            function todaysConf() {
                if (document.getElementById("todaysConf").innerHTML=="Показать только сегодняшние")
                {
                    sessionStorage.setItem('sortedTime', true);
                    for (var i = 0; i < ($('#eventsData').children(".evBox").length); i++) {
                        var id = $('#eventsData').children(".evBox")[i].id;
                        console.log(($('#eventsData').children(".evBox")[i].children[4].innerText));
                        if (!compareDate($('#eventsData').children(".evBox")[i].children[4].innerText))
                            // $('#eventsData').children(".evBox")[i].remove();
                            document.getElementById(""+ id+ "").style.display = "none";
                    }
                    document.getElementById("todaysConf").style.color = "#EA4101";
                    document.getElementById("todaysConf").innerHTML = "Показать все";
                    gotoEvent();
                }
                else {
                    var confList = JSON.parse(sessionStorage.getItem('conf_list'));
                    // console.log(confList);
                    sessionStorage.removeItem('sortedTime');

                    $('#eventsData').children(".evBox").remove();
                    for (iter in confList) {
                        var dateStart = $.format.date(confList[iter].dateStart, "dd MMM yyyy H:mm");
                        var dateEnd = $.format.date(confList[iter].dateEnd, "dd MMM yyyy H:mm");


                        $('#eventsData').append('<tr class="evBox" id = "' + resault[iter].id + '">' +
                            '<td>' + resault[iter].name + '</td>' +
                            '<td>' + dateStart + ' - ' + dateEnd + '</td>' +
                            '<td>' + resault[iter].address + '</td>' +
                            '<td>' + resault[iter].organizations[0].name + '<img class="trashConf" onclick="event.stopPropagation()"  src="../img/delete.png" id="' + resault[iter].id + ' " width=20px></td>' +
                            '<td class="timestamp">' + resault[iter].dateStart + '-' + resault[iter].dateEnd + '</td>' +
                            '</tr>');
                    }
                    document.getElementById("todaysConf").style.color = "#3F4F98";
                    document.getElementById("todaysConf").innerHTML = "Показать только сегодняшние";
                    gotoEvent();
                    searchConf();
                }
            };

        },
        error:function(resault){
            console.log(resault);
        }
    });
})

function searchConf() {
    var $rows = $('#eventsData tr');
    $('#searchConf').keyup(function() {
        var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase().split(' ');

        $rows.hide().filter(function() {
            var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
            var matchesSearch = true;

            $(val).each(function(index, value) {
                matchesSearch = (!matchesSearch) ? false : ~text.indexOf(value);
            });
            return matchesSearch;
        }).show();
    });
}

// Переход на событие
function gotoEvent() {
    $("#tableEvents .evBox").click(function () {
        sessionStorage.setItem('currentConf', this.id);
        document.location.href = "./events/card.html";
    });
}

//Scroll top
$(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() != 0) {
            $('#toTop').fadeIn();
        } else {
            $('#toTop').fadeOut();
        }
    });
    $('#toTop').click(function () {
        $('body,html').animate({scrollTop: 0}, 800);
    });
});
