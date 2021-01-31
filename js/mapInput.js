var coords = [];
addressConf = JSON.parse(sessionStorage.getItem('conf'));
coords.push(addressConf.latitude);
coords.push(addressConf.longitude);

ymaps.ready(init);

function init() {
    var myPlacemark,
        myMap = new ymaps.Map('map', {
            center: coords,
            zoom: 12
        }, {
            searchControlProvider: 'yandex#search'
        });
    myGeoObject = new ymaps.GeoObject();
    myMap.geoObjects
        .add(new ymaps.Placemark(coords, {
            balloonContent: ''+ addressConf.address+''
        }, {
            preset: 'islands#icon',
            iconColor: '#92CBC5'
        }))

    // Слушаем клик на карте.
    myMap.events.add('click', function (e) {
        var coords = e.get('coords');

        // Если метка уже создана – просто передвигаем ее.
        if (myPlacemark) {
            myPlacemark.geometry.setCoordinates(coords);
        }
        // Если нет – создаем.
        else {
            myPlacemark = createPlacemark(coords);
            myMap.geoObjects.add(myPlacemark);
            // Слушаем событие окончания перетаскивания на метке.
            myPlacemark.events.add('dragend', function () {
                getAddress(myPlacemark.geometry.getCoordinates());
            });
        }
        getAddress(coords);
        sessionStorage.setItem('coords',JSON.stringify(coords));
    });

    // Создание метки.
    function createPlacemark(coords) {

        return new ymaps.Placemark(coords, {
            iconCaption: 'поиск...'
        }, {
            preset: 'islands#violetDotIconWithCaption',
            iconColor:  '#EA4101',
            draggable: true
        });
    }

    // Определяем адрес по координатам (обратное геокодирование).
    function getAddress(coords) {
        myPlacemark.properties.set('iconCaption', 'поиск...');
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);

            myPlacemark.properties
                .set({
                    // Формируем строку с данными об объекте.
                    iconCaption: [
                        // Название населенного пункта или вышестоящее административно-территориальное образование.
                        firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                        // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                        firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                    ].filter(Boolean).join(', '),
                    // В качестве контента балуна задаем строку с адресом объекта.
                    balloonContent: firstGeoObject.getAddressLine()

                });
            sessionStorage.setItem('addressConf', JSON.stringify(firstGeoObject.getAddressLine()));
        });
    }
}
