/* eslint import/no-extraneous-dependencies: 0 */
import {MetricsPanelCtrl} from 'app/plugins/sdk';
import TimeSeries from 'app/core/time_series2';
import kbn from 'app/core/utils/kbn';

import _ from 'lodash';
import mapRenderer from './map_renderer';
import DataFormatter from './data_formatter';

const panelDefaults = {
  ak: '4AWvSkHwSEcX8nwS0bZBcFZTDw70NzZZ',
  mapCenters: [],
  maxDataPoints: 1,
  theme: 'normal',
  lat: 39.915,
  lng: 116.404,
  initialZoom: 11,
  valueName: 'total',
  locationData: 'countries',
  esMetric: 'Count',
  decimals: 0,
  navigation: true,
  scale: true,
  overviewMap: false,
  mapType: true
};

export default class BaidumapCtrl extends MetricsPanelCtrl {
  constructor($scope, $injector, contextSrv) {
    super($scope, $injector);

    this.setMapProvider(contextSrv);
    _.defaults(this.panel, panelDefaults);
    this.dataFormatter = new DataFormatter(this, kbn);

    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('panel-teardown', this.onPanelTeardown.bind(this));
    this.events.on('data-snapshot-load', this.onDataSnapshotLoad.bind(this));
    //this.loadLocationDataFromFile();
  }

  setMapProvider(contextSrv) {
//    this.tileServer = contextSrv.user.lightTheme ? 'CartoDB Positron' : 'CartoDB Dark';
    this.tileServer = 'CartoDB Positron';
    this.setMapSaturationClass();
  }

  setMapSaturationClass() {
    if (this.tileServer === 'CartoDB Dark') {
      this.saturationClass = 'map-darken';
    } else {
      this.saturationClass = '';
    }
  }

  loadLocationDataFromFile(reload) {
    if (this.map && !reload) return;

    if (this.panel.snapshotLocationData) {
      this.locations = this.panel.snapshotLocationData;
      return;
    }

    if (this.panel.locationData === "jsonp endpoint") {

    } else if (this.panel.locationData === "json endpoint") {
      if (!this.panel.jsonUrl) return;

    } else if (this.panel.locationData === "table") {
      // .. Do nothing

    } else if (this.panel.locationData !== "geohash" && this.panel.locationData !== "json result") {

    }
  }

  reloadLocations(res) {
    this.locations = res;
    this.refresh();
  }

  onPanelTeardown() {
    if (this.map) delete this.map;
  }

  onInitEditMode() {
    this.addEditorTab('Baidumap', 'public/plugins/grafana-baidumap-panel/partials/editor.html', 2);
  }

  onDataReceived(dataList) {
    if (!dataList) return;
    if (this.dashboard.snapshot && this.locations) {
      this.panel.snapshotLocationData = this.locations;
    }

    const data = [];
    if (this.panel.locationData === "geohash") {
      this.dataFormatter.setGeohashValues(dataList, data);
    } else if (this.panel.locationData === "table") {
      const tableData = dataList.map(DataFormatter.tableHandler.bind(this));
      this.dataFormatter.setTableValues(tableData, data);
    } else if (this.panel.locationData === "json result") {
      this.series = dataList;
      this.dataFormatter.setJsonValues(data);
    } else {
      this.series = dataList.map(this.seriesHandler.bind(this));
      this.dataFormatter.setValues(data);
    }

    this.data = data;
    if (this.data.length) {
      this.centerOnLastGeoHash();
    } else {
      this.render();
    }
  }

  centerOnLastGeoHash() {
    const markerList = {};
    markerList.mapCenterLatitude = _.last(this.data).locationLatitude;
    markerList.mapCenterLongitude = _.last(this.data).locationLongitude;
    this.panel.mapCenters.push(markerList);
    this.render();
    //this.setNewMapCenter();
  }

  onDataSnapshotLoad(snapshotData) {
    this.onDataReceived(snapshotData);
  }

  seriesHandler(seriesData) {
    const series = new TimeSeries({
      datapoints: seriesData.datapoints,
      alias: seriesData.target,
    });
    
    series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
    return series;
  }
  
  setNewMapCenter() {
    this.render();
  }

  setZoom() {
    this.map.setZoom(parseInt(this.panel.initialZoom, 10) || 1);
  }

  setStyle() {
		this.map.setMapStyle({ style: this.panel.theme });
	}

  setAK() {
    let x = document.body;
    let s = document.getElementsByTagName("script");
    let len = s.length;
    x.removeChild(s[len - 1]);
    delete this.map;
    this.render();
	}

  navigationControl() {
    if (this.panel.navigation == true) {
      this.map.addControl(this.navigationSwitch);
    } else {
      this.map.removeControl(this.navigationSwitch);
    }
  }

  scaleControl() {
    if (this.panel.scale == true) {
      this.map.addControl(this.scaleSwitch);
    } else {
      this.map.removeControl(this.scaleSwitch);
    }
  }

  overviewMapControl() {
    if (this.panel.overviewMap == true) {
      this.map.addControl(this.overviewMapSwitch);
    } else {
      this.map.removeControl(this.overviewMapSwitch);
    }
  }

  mapTypeControl() {
    if (this.panel.mapType == true) {
      this.map.addControl(this.mapTypeSwitch);
    } else {
      this.map.removeControl(this.mapTypeSwitch);
    }
  }

  resize() {
    
  }

  toggleStickyLabels() {
    console.log(this.panel.stickyLabels);
  }

  changeLocationData() {
    if (this.panel.locationData === 'geohash') {
      this.render();
    }
  }

/* eslint class-methods-use-this: 0 */
  link(scope, elem, attrs, ctrl) {
    mapRenderer(scope, elem, attrs, ctrl);
  }
}

BaidumapCtrl.templateUrl = 'module.html';
