$(document).ready(function () {

	$.ajax({

		url: address + '/event?eventId=' + sessionStorage.getItem('currentConf'),
		success: function(resault){
			console.log(resault);
			resault = resault.response;
			var dateStart = $.format.date(resault.dateStart, "dd MMMM yyyy");
			var dateEnd = $.format.date(resault.dateEnd, "dd MMMM yyyy");
			var timeStart = $.format.date(resault.dateStart, "H:mm");
			var timeEnd = $.format.date(resault.dateEnd, "H:mm");
			sessionStorage.setItem('conf', JSON.stringify(resault));
			var empOnly = resault.employeesOnly;
			if(empOnly === true){
				var empOnlyText = "<p>только для сотрудников</p>";
			}else{
				empOnlyText = "";
			}
			$('#confInfo').append("<div class = 'topConfBlock'><h2 class = 'nameConf'>" + resault.name +"</h2><a href = 'card/edit.html'><img src='../img/edit.png' width=40px></a></div>" +
				"<div class='inner background-light'><h3>Описание:</h3><h4 class = 'shortDesc'>" +
                resault.description+"</h4><p class = 'description'>" +
                resault.overview + "</p></div>" +
				"<div class='inner background-light'><div class = 'time'><img src='+"+address+" + '/event/banner?eventId="+ resault.id +"'><h4>" +
				dateStart + ' - ' + dateEnd + "</h4><h4>" + timeStart + ' - ' +
				timeEnd + "</h4></div></div>" +
				"<div class='inner background-light'><div class = 'organization'><img id='orgLogo' src='../img/foto.png' alt='fotoOrg'><h3>Организатор:</h3><h4>" +
				resault.organizations[0].name+ "</h4><a href="+ "resault.organizations[0].site"  +">" +
				resault.organizations[0].site+ "</a>"+ empOnlyText +"</div></div>" +
				"<div class='inner background-light'><div class = 'address'><img src='../img/mapConf.png' alt='fotoOrg'><h3>Адрес:</h3><h4>" + resault.address+ "</h4></div></div>");

			$(function () {
				$.ajax ({
					url: address + '/organization/logo?organizationId='+ resault.organizations[0].id,
					dataType : 'binary',
					beforeSend: function(xhr) {
						xhr.setRequestHeader('Authorization', getCookie('access_token'));
					},
					success: function(resault){
						var url = URL.createObjectURL(resault);
						$("#orgLogo").attr("src", url);
					},
					error: function(resault){
						console.log(resault);
					}
				})
			})


		},

		error:function(data){
			console.log(data);
		}
	});

	$("#showUsers").on("click",function () {
		// $.ajax({
		document.location.href = "./events/card/users.html";

		//  });

	});


})
