'use strict';

System.register(['./css/leaflet.css!', './libs/baidumap.js'], function (_export, _context) {
  "use strict";

  var MP;
  function link(scope, elem, attrs, ctrl) {
    ctrl.events.on('render', function () {
      render();
      ctrl.renderingCompleted();
    });

    function render() {
      if (!ctrl.data) return;

      var mapContainer = elem.find('.mapcontainer');

      if (mapContainer[0].id.indexOf('{{') > -1) {
        return;
      }
      if (!ctrl.map) {
        MP(ctrl.panel.ak).then(function (BMap) {
          console.log('start');
          var elementId = "mapid_" + ctrl.panel.id;
          ctrl.map = new BMap.Map(elementId);
          ctrl.map.centerAndZoom(new BMap.Point(ctrl.panel.lng, ctrl.panel.lat), parseInt(ctrl.panel.initialZoom, 10));
          ctrl.map.enableScrollWheelZoom();
          ctrl.map.setMapStyle({ style: ctrl.panel.theme });

          ctrl.navigationSwitch = new BMap.NavigationControl();
          ctrl.scaleSwitch = new BMap.ScaleControl();
          ctrl.overviewMapSwitch = new BMap.OverviewMapControl({ isOpen: true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT });
          ctrl.mapTypeSwitch = new BMap.MapTypeControl();

          if (ctrl.panel.navigation === true) ctrl.map.addControl(ctrl.navigationSwitch);
          if (ctrl.panel.scale === true) ctrl.map.addControl(ctrl.scaleSwitch);
          if (ctrl.panel.overviewMap === true) ctrl.map.addControl(ctrl.overviewMapSwitch);
          if (ctrl.panel.mapType === true) ctrl.map.addControl(ctrl.mapTypeSwitch);

          ctrl.map.addEventListener("dragend", function () {
            var center = ctrl.map.getCenter();
            ctrl.panel.lat = center.lat;
            ctrl.panel.lng = center.lng;
          });

          function addMarker(point) {
            var marker = new BMap.Marker(point);
            marker.addEventListener("click", attribute);
            ctrl.map.addOverlay(marker);
          }

          function attribute(e) {
            var p = e.target;
            alert("test location: " + p.getPosition().lng + "," + p.getPosition().lat);
          }

          var list = ctrl.panel.mapCenters;
          for (var i in list) {
            var point = new BMap.Point(list[i].mapCenterLongitude, list[i].mapCenterLatitude);
            addMarker(point);
          }
        });
      }
      //ctrl.map.resize();

      //if (ctrl.mapCenterMoved) ctrl.map.panToMapCenter();

      //if (!ctrl.map.legend && ctrl.panel.showLegend) ctrl.map.createLegend();

      //ctrl.map.drawCircles();
    }
  }

  _export('default', link);

  return {
    setters: [function (_cssLeafletCss) {}, function (_libsBaidumapJs) {
      MP = _libsBaidumapJs.MP;
    }],
    execute: function () {}
  };
});
//# sourceMappingURL=map_renderer.js.map
