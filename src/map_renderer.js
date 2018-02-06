import './css/leaflet.css!';
import BaiduMap from './baidumap';
import { MP } from "./libs/baidumap.js";  


export default function link(scope, elem, attrs, ctrl) {
  ctrl.events.on('render', () => {
    render();
    ctrl.renderingCompleted();
  });

  function render() {
    if (!ctrl.data) return;

    const mapContainer = elem.find('.mapcontainer');

    if (mapContainer[0].id.indexOf('{{') > -1) {
      return;
    }

    if (!ctrl.map) {
      MP(ctrl.panel.ak).then(BMap => {
        console.log(ctrl.panel);
        const elementId = "mapid_" + ctrl.panel.id;
        ctrl.map = new BMap.Map(elementId);
        ctrl.map.centerAndZoom(new BMap.Point(ctrl.panel.mapCenterLatitude, ctrl.panel.mapCenterLongitude), ctrl.panel.initialZoom);
        ctrl.map.enableScrollWheelZoom();

        ctrl.panel.navigationSwitch = new BMap.NavigationControl();
        ctrl.panel.scaleSwitch = new BMap.ScaleControl();
        ctrl.panel.overviewMapSwitch = new BMap.OverviewMapControl({isOpen:true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT});
        ctrl.panel.mapTypeSwitch = new BMap.MapTypeControl();     
        
        if(ctrl.panel.navigation === true)ctrl.map.addControl(ctrl.panel.navigationSwitch);
        if(ctrl.panel.scale === true)ctrl.map.addControl(ctrl.panel.scaleSwitch);
        if(ctrl.panel.overviewMap === true)ctrl.map.addControl(ctrl.panel.overviewMapSwitch);
        if(ctrl.panel.mapType === true)ctrl.map.addControl(ctrl.panel.mapTypeSwitch);
      });
    }
    //ctrl.map.resize();

    //if (ctrl.mapCenterMoved) ctrl.map.panToMapCenter();

    //if (!ctrl.map.legend && ctrl.panel.showLegend) ctrl.map.createLegend();

    //ctrl.map.drawCircles();
  }
}
