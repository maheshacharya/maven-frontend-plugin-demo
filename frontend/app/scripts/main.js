var layer ='';// 'world-countries';
$(document).ready(function () {

    loadMapLayer('http://openlayers.org/en/v3.17.1/examples/data/geojson/countries.geojson');//url + layer);
    $('.options').on('change', function () {
        layer = $('.options option:selected').val();
        var u = url + layer;
        loadMapLayer(u);
    });
});

var url = 'http://openlayers.org/en/v3.17.1/examples/data/geojson/countries.geojson';


function loadMapLayer(mapLayerDataSource) {

    var vectorSource = new ol.source.Vector({
        url: mapLayerDataSource,
        format: new ol.format.GeoJSON()
    });
    var lab = document.getElementById('label-container');
    lab.innerHTML = '';

    $('#map').html('');
    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            new ol.layer.Vector({
                source: vectorSource
            })
        ],
        renderer: 'canvas',
        target: 'map',
        view: new ol.View({
            center: [0, 0],//ol.proj.transform([42.3601, -71.0589], 'EPSG:3857', 'EPSG:4326'),
            zoom: 2

        })
    });
    map.minZoomLevel = 2;

    if (layer == 'world-countries') {
        map.getView().setZoom(2);
    } else {
        map.getView().setCenter(ol.proj.transform([-99.9018, 41.4925], 'EPSG:4326', 'EPSG:3857'));
        map.getView().setZoom(5);
    }

    // map.setCenter(OpenLayers.LonLat(42.3601, 71.0589), 5);
// a normal select interaction to handle click
    var select = new ol.interaction.Select();
    map.addInteraction(select);

    var selectedFeatures = select.getFeatures();

// a DragBox interaction used to select features by drawing boxes
    var dragBox = new ol.interaction.DragBox({
        condition: ol.events.condition.platformModifierKeyOnly
    });

    map.addInteraction(dragBox);

    var infoBox = document.getElementById('info');

    dragBox.on('boxend', function () {
        // features that intersect the box are added to the collection of
        // selected features, and their names are displayed in the "info"
        // div
        var info = [];
        var extent = dragBox.getGeometry().getExtent();
        vectorSource.forEachFeatureIntersectingExtent(extent, function (feature) {
            selectedFeatures.push(feature);
            // info.push(feature.get('name'));
            if (layer == 'world-countries') {
                info.push(feature.get('name'));
            } else {
                info.push(feature.get('NAME'));
            }
        });

        if (info.length > 0) {
            //infoBox.innerHTML = info.join(', ');
            var label = $('#info');
            $(label).find('.dialog-main').innerHTML = info.join(', ');
           // var label = document.getElementById('label-container');
          //  value = info.join(', ');
            //var label = $(".info");
            //$(label).find(".dialog-main").html(value);
            $(label).fadeIn();

        }
    });

// clear selection when drawing a new box and when clicking on the map
    dragBox.on('boxstart', function () {
        selectedFeatures.clear();
        infoBox.innerHTML = '&nbsp;';
    });
    map.on('click', function (e) {
        selectedFeatures.clear();
        //infoBox.innerHTML = " ";
        map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
           // var label = document.getElementById('label-container');

            var label = $('#info');
              $('.dialog-main').html('sldklskkddddsd');
            //alert(label);
            if (layer == 'world-countries') {
                $('.dialog-main').html('');
                $('.selected-values').val(feature.get('name'));
            } else {
                $('.dialog-main').html(feature.get('NAME'));
                $('.selected-values').val(feature.get('NAME'));
            }

            $(label).css('z-index', 9999999);
          

            $(label).show();


          //  alert($(label))

        });

    });
}




