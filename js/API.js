function ajaxUserPhoto(id) {
    $.ajax({
        url: address + '/user/profile/photo?userId='+id,
        type: "GET",
        dataType: "binary",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', getCookie('access_token'));
        },
        success: function(res){

            if (res) {
                var src = URL.createObjectURL(res);
                $('#userId_'+id).attr("src", src);

            }
        },
        error:function(data){
            console.log(data);
        }
    });
}
function trashConf(id) {
    $.ajax({
        url: address + '/event/delete?eventId=' + id,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', getCookie('access_token'));
        },
        success: function (resault) {
            $('#eventsData').children("#" + id + "").remove()
            console.log(resault);
        },
        error: function (resault) {
            console.log(resault);
        }
    });
}
function ajaxLogoOrg(orgId,orgUrl ) {
    $.ajax ({
        url: address + '/organization/logo?organizationId='+ orgId,
        dataType : 'binary',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', getCookie('access_token'));
        },
        success: function(resault){
            var url = URL.createObjectURL(resault);
            $("#orgLogo").attr("src", url);
            document.getElementById('urlOrg').innerHTML = orgUrl;
        },
        error: function(resault){
            console.log(resault);
        }
    })
}