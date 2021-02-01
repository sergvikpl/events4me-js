$(document).ready(function () {

    var conf = JSON.parse(sessionStorage.getItem('conf'));
    var coords = [];
    coords.push(conf.latitude);
    coords.push(conf.longitude);

    sessionStorage.setItem('coords',JSON.stringify(coords));

    var organizations = JSON.parse(sessionStorage.getItem('organizations'));

    var activities = document.getElementById("orgSelect");

    activities.addEventListener("change", function() {
        if  (getValue("orgSelect")=="Не выбрано"){
            $("#orgLogo").attr("src", "./src/foto.png");
            document.getElementById("urlOrg").innerText = "";
        }
        else {
            var file = getValue("orgSelect");
            console.log(file);
            var orgId;
            var orgUrl;
            organizations.reduce(function(previousValue, currentValue){
                if (currentValue.name==file)
                {
                    orgId =  currentValue.id;
                    orgUrl = currentValue.site;
                    sessionStorage.setItem("confJson", JSON.stringify(currentValue));
                }
            },0);
            ajaxLogoOrg(orgId, orgUrl);
        }
    });

    $.ajax ({
        url: address + '/organization',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', getCookie('access_token'));
        },
        success: function(resault){
            resault = resault.response;
            sessionStorage.setItem('organizations', JSON.stringify(resault));
            for (i in resault) {
                $("#orgSelect").append('<option>'+ resault[i].name +'</option>');
            }
            $("#orgSelect").val(conf.organizations[0].name);
            ajaxLogoOrg(conf.organizations[0].id, conf.organizations[0].site );
            sessionStorage.setItem("confJson", JSON.stringify(conf.organizations[0]));
        },
        error: function(resault){
            console.log(resault);
        }
    })




    var dateStart = $.format.date(conf.dateStart, "yyyy-MM-dd");
    var dateEnd = $.format.date(conf.dateEnd, "yyyy-MM-dd");
    var timeStart = $.format.date(conf.dateStart, "HH:mm");
    var timeEnd = $.format.date(conf.dateEnd, "HH:mm");

    setValue('nameConf',conf.name);
    setValue('shortDesc', conf.description);
    setValue('description', conf.overview);
    setValue('dateStart', dateStart);
    setValue('dateEnd', dateEnd);
    setValue('timeStart', timeStart);
    setValue('timeEnd', timeEnd);
    if(conf.employeesOnly === true){
        $('#employee').prop('checked', true);
    }else{
        $('#employee').prop('checked', false);
    }
    //setValue('nameOrg', conf.organizations[0].name);
    //setValue('siteOrg', conf.organizations[0].site);
    // setValue('address', conf.address);

    $("#confPhoto").attr("src", address+ '/event/banner?eventId='+ conf.id)

})
angular.module('myApp', []).controller("myController", function($scope,$http){

    $scope.saveForm = function () {

        var DateStart = getUnix(getValue("dateStart"), getValue("timeStart"));
        var DateEnd = getUnix(getValue("dateEnd"), getValue("timeEnd"));
        var formData = new FormData();
        var conf = JSON.parse(sessionStorage.getItem('conf'));

        formData.append("banner", $("#fileSend")[0].files.item(0));
        formData.append('event', new Blob([JSON.stringify({"address":JSON.parse(sessionStorage.getItem('address')),"banner":""+address+"/event/banner",
            "description": getValue("shortDesc"),
            "name":getValue("nameConf"),
            "organizations":[JSON.parse(sessionStorage.getItem("confJson"))],
            "overview":getValue("description"),
            "sections":[],
            "url":"",
            "employeesOnly":($('#employee').is(":checked")),
            "dateEnd": DateEnd,
            "dateStart": DateStart,
            "address": sessionStorage.getItem('addressConf'),
            "latitude":JSON.parse(sessionStorage.getItem('coords'))[0],
            "longitude":JSON.parse(sessionStorage.getItem('coords'))[1],
            "id":conf.id})], {
            type: "application/json"
        }));

        console.log()
        console.log(JSON.stringify([JSON.parse(sessionStorage.getItem("confJson"))]))
        $http({
            url: address + '/event/update',
            method: 'POST',
            headers: {
                "Authorization": getCookie('access_token'),
                "Content-Type": undefined
            },
            data: formData,
            transformRequest: function (data, headersGetterFunction) {
                return data;
            },

        }).then(
            function onSuccess(response) {
                console.log(response);
                sessionStorage.setItem("currentConf", response.data.response.id);
                document.location.href = "../../events/card.html";
            }).catch(function onError(response) {
            console.log(response);
        });
    }
});

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


$('#logout-button').click(function(event) {
  event.preventDefault();
  $.ajax({
    url: address + '/authorization/logout',
    type: "GET",
    success: function() {
      console.log("Success logout");
      document.location.href = "../../login.html";
    },
    error: function() {
      console.log("Fail logout");
      document.location.href = "../../login.html";
    }
  })
})
