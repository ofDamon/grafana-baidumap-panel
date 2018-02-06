'use strict';

System.register(['./css/leaflet.css!', './baidumap', './libs/baidumap.js'], function (_export, _context) {
  "use strict";

  var BaiduMap, MP;
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
          console.log(ctrl.panel);
          var elementId = "mapid_" + ctrl.panel.id;
          ctrl.map = new BMap.Map(elementId);
          ctrl.map.centerAndZoom(new BMap.Point(ctrl.panel.mapCenterLatitude, ctrl.panel.mapCenterLongitude), ctrl.panel.initialZoom);
          ctrl.map.enableScrollWheelZoom();

          ctrl.panel.navigationSwitch = new BMap.NavigationControl();
          ctrl.panel.scaleSwitch = new BMap.ScaleControl();
          ctrl.panel.overviewMapSwitch = new BMap.OverviewMapControl({ isOpen: true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT });
          ctrl.panel.mapTypeSwitch = new BMap.MapTypeControl();

          if (ctrl.panel.navigation === true) ctrl.map.addControl(ctrl.panel.navigationSwitch);
          if (ctrl.panel.scale === true) ctrl.map.addControl(ctrl.panel.scaleSwitch);
          if (ctrl.panel.overviewMap === true) ctrl.map.addControl(ctrl.panel.overviewMapSwitch);
          if (ctrl.panel.mapType === true) ctrl.map.addControl(ctrl.panel.mapTypeSwitch);
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
    setters: [function (_cssLeafletCss) {}, function (_baidumap) {
      BaiduMap = _baidumap.default;
    }, function (_libsBaidumapJs) {
      MP = _libsBaidumapJs.MP;
    }],
    execute: function () {}
  };
});
//# sourceMappingURL=map_renderer.js.map
