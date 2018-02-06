/* eslint import/no-extraneous-dependencies: 0 */
import {MetricsPanelCtrl} from 'app/plugins/sdk';
import TimeSeries from 'app/core/time_series2';
import kbn from 'app/core/utils/kbn';

import _ from 'lodash';
import mapRenderer from './map_renderer';
import DataFormatter from './data_formatter';
import { MP } from "./libs/baidumap.js";  

const panelDefaults = {
  ak: "4AWvSkHwSEcX8nwS0bZBcFZTDw70NzZZ",
  maxDataPoints: 1,
  theme: "normal",
  mapCenterLatitude: 116.404,
  mapCenterLongitude: 39.915,
  initialZoom: 11,
  valueName: "total",
  locationData: "countries",
  esMetric: "Count",
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
      if (!this.panel.jsonpUrl || !this.panel.jsonpCallback) return;

      window.$.ajax({
        type: "GET",
        url: this.panel.jsonpUrl + "?callback=?",
        contentType: "application/json",
        jsonpCallback: this.panel.jsonpCallback,
        dataType: "jsonp",
        success: res => {
          this.locations = res;
          this.render();
        }
      });
    } else if (this.panel.locationData === "json endpoint") {
      if (!this.panel.jsonUrl) return;

      window.$.getJSON(this.panel.jsonUrl).then(res => {
        this.locations = res;
        this.render();
      });
    } else if (this.panel.locationData === "table") {
      // .. Do nothing
    } else if (this.panel.locationData !== "geohash" && this.panel.locationData !== "json result") {
      window.$.getJSON("public/plugins/grafana-worldmap-panel/data/" + this.panel.locationData + ".json").then(this.reloadLocations.bind(this));
    }
  }

  reloadLocations(res) {
    this.locations = res;
    this.refresh();
  }

  onPanelTeardown() {
    if (this.map) this.map.remove();
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

    if (this.panel.locationData === 'geohash') {
      this.dataFormatter.setGeohashValues(dataList, data);
    } else if (this.panel.locationData === 'table') {
      const tableData = dataList.map(DataFormatter.tableHandler.bind(this));
      this.dataFormatter.setTableValues(tableData, data);
    } else if (this.panel.locationData === 'json result') {
      this.series = dataList;
      this.dataFormatter.setJsonValues(data);
    } else {
      this.series = dataList.map(this.seriesHandler.bind(this));
      this.dataFormatter.setValues(data);
    }
    this.data = data;

    if (this.data.length && this.panel.mapCenter === 'Last GeoHash') {
      this.centerOnLastGeoHash();
    } else {
      this.render();
    }
  }

  centerOnLastGeoHash() {
    mapCenters[this.panel.mapCenter].mapCenterLatitude = _.last(this.data).locationLatitude;
    mapCenters[this.panel.mapCenter].mapCenterLongitude = _.last(this.data).locationLongitude;
    this.setNewMapCenter();
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
    if (this.panel.mapCenter !== 'custom') {
      this.panel.mapCenterLatitude = mapCenters[this.panel.mapCenter].mapCenterLatitude;
      this.panel.mapCenterLongitude = mapCenters[this.panel.mapCenter].mapCenterLongitude;
    }
    this.mapCenterMoved = true;
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
      this.map.addControl(this.panel.navigationSwitch);
    } else {
      this.map.removeControl(this.panel.navigationSwitch);
    }
  }

  scaleControl() {
    if (this.panel.scale == true) {
      this.map.addControl(this.panel.scaleSwitch);
    } else {
      this.map.removeControl(this.panel.scaleSwitch);
    }
  }

  overviewMapControl() {
    if (this.panel.overviewMap == true) {
      this.map.addControl(this.panel.overviewMapSwitch);
    } else {
      this.map.removeControl(this.panel.overviewMapSwitch);
    }
  }

  mapTypeControl() {
    if (this.panel.mapType == true) {
      this.map.addControl(this.panel.mapTypeSwitch);
    } else {
      this.map.removeControl(this.panel.mapTypeSwitch);
    }
  }

  resize() {
    
  }

  toggleStickyLabels() {
    console.log(this.panel.stickyLabels);
  }

  changeLocationData() {
    this.loadLocationDataFromFile(true);

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
