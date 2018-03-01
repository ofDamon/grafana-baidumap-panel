'use strict';

System.register(['app/plugins/sdk', 'app/core/time_series2', 'app/core/utils/kbn', 'lodash', './map_renderer', './data_formatter', './libs/baidumap.js'], function (_export, _context) {
  "use strict";

  var MetricsPanelCtrl, TimeSeries, kbn, _, mapRenderer, DataFormatter, MP, _typeof, _createClass, panelDefaults, BaidumapCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_appPluginsSdk) {
      MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
    }, function (_appCoreTime_series) {
      TimeSeries = _appCoreTime_series.default;
    }, function (_appCoreUtilsKbn) {
      kbn = _appCoreUtilsKbn.default;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_map_renderer) {
      mapRenderer = _map_renderer.default;
    }, function (_data_formatter) {
      DataFormatter = _data_formatter.default;
    }, function (_libsBaidumapJs) {
      MP = _libsBaidumapJs.MP;
    }],
    execute: function () {
      _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };

      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      panelDefaults = {
        ak: "4AWvSkHwSEcX8nwS0bZBcFZTDw70NzZZ",
        maxDataPoints: 1,
        theme: "normal",
        lat: 39.915,
        lng: 116.404,
        initialZoom: 11,
        valueName: "current",
        locationData: "table",
        esMetric: "Count",
        decimals: 0,
        navigation: true,
        scale: true,
        hideEmpty: false,
        overviewMap: false,
        hideZero: false,
        mapType: true
      };

      BaidumapCtrl = function (_MetricsPanelCtrl) {
        _inherits(BaidumapCtrl, _MetricsPanelCtrl);

        function BaidumapCtrl($scope, $injector, contextSrv) {
          _classCallCheck(this, BaidumapCtrl);

          var _this = _possibleConstructorReturn(this, (BaidumapCtrl.__proto__ || Object.getPrototypeOf(BaidumapCtrl)).call(this, $scope, $injector));

          _this.setMapProvider(contextSrv);
          _.defaults(_this.panel, panelDefaults);
          _this.dataFormatter = new DataFormatter(_this, kbn);
          _this.markers = [];
          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('panel-teardown', _this.onPanelTeardown.bind(_this));
          _this.events.on('data-snapshot-load', _this.onDataSnapshotLoad.bind(_this));
          //this.loadLocationDataFromFile();
          return _this;
        }

        _createClass(BaidumapCtrl, [{
          key: 'setMapProvider',
          value: function setMapProvider(contextSrv) {
            //    this.tileServer = contextSrv.user.lightTheme ? 'CartoDB Positron' : 'CartoDB Dark';
            this.tileServer = 'CartoDB Positron';
            this.setMapSaturationClass();
          }
        }, {
          key: 'setMapSaturationClass',
          value: function setMapSaturationClass() {
            if (this.tileServer === 'CartoDB Dark') {
              this.saturationClass = 'map-darken';
            } else {
              this.saturationClass = '';
            }
          }
        }, {
          key: 'loadLocationDataFromFile',
          value: function loadLocationDataFromFile(reload) {
            if (this.map && !reload) return;

            if (this.panel.snapshotLocationData) {
              this.locations = this.panel.snapshotLocationData;
              return;
            }

            if (this.panel.locationData === "jsonp endpoint") {} else if (this.panel.locationData === "json endpoint") {
              if (!this.panel.jsonUrl) return;
            } else if (this.panel.locationData === "table") {
              // .. Do nothing

            } else if (this.panel.locationData !== "geohash" && this.panel.locationData !== "json result") {}
          }
        }, {
          key: 'reloadLocations',
          value: function reloadLocations(res) {
            this.locations = res;
            this.refresh();
          }
        }, {
          key: 'onPanelTeardown',
          value: function onPanelTeardown() {
            if (this.map) delete this.map;
          }
        }, {
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('Baidumap', 'public/plugins/grafana-baidumap-panel/partials/editor.html', 2);
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {
            if (!dataList) return;
            if (this.dashboard.snapshot && this.locations) {
              this.panel.snapshotLocationData = this.locations;
            }
            var data = [];
            if (this.panel.locationData === "geohash") {
              this.dataFormatter.setGeohashValues(dataList, data);
            } else if (this.panel.locationData === "table") {
              var tableData = dataList.map(DataFormatter.tableHandler.bind(this));
              this.dataFormatter.setTableValues(tableData, data);
            } else if (this.panel.locationData === "json result") {
              this.series = dataList;
              this.dataFormatter.setJsonValues(data);
            } else {
              var _tableData = dataList.map(DataFormatter.tableHandler.bind(this));
              this.dataFormatter.setTableValues(_tableData, data);
            }

            var datas = this.filterEmptyAndZeroValues(data);
            console.log(datas);
            if (_typeof(this.data) === 'object') this.data.splice(0, this.data.length);
            this.markers.splice(0, this.markers.length);
            if (datas.length) {
              this.data = datas;

              if (this.map) {
                this.addNode(this.BMap);
              } else {
                this.render();
              }
            } else {
              if (this.map) this.map.clearOverlays();
              this.render();
            }
          }
        }, {
          key: 'addMarker',
          value: function addMarker(point, BMap, data) {
            var myIcon = new BMap.Icon("public/plugins/grafana-baidumap-panel/images/pins6-poi.png", new BMap.Size(30, 30));
            var marker = new BMap.Marker(point, { icon: myIcon });
            /*
            this.markers.push(marker);
            if(this.markers.length == this.data.length){
              const markerClusterer = new BMapLib.MarkerClusterer(this.map, {
                markers: this.markers
              });
            }*/
            //this.map.setViewport(pointArray);
            marker.enableDragging();
            var info = JSON.parse(data.locationName);
            var scontent = "";
            scontent += '<a href="' + info.url + '"><div class="infobox" id="infobox"><div class="infobox-content" style="display:block">';
            scontent += '<div class="infobox-header"><div class="infobox-header-icon"><img src="public/plugins/grafana-baidumap-panel/images/pins6.png"></div>';
            scontent += '<div class="infobox-header-name"><p>ffffff100000053c</p></div>';
            scontent += '<div class="infobox-header-type" style="min-width:250px"><p>' + info.label + '</p></div></div>';
            scontent += '<div class="infobox-footer">在线时间：10分钟前</div>';
            scontent += '<div class="infobox-footer-right"></div></div><div class="arrow"></div></div></a>';

            var infoWindow = new BMap.InfoWindow(scontent); // 创建信息窗口对象
            marker.addEventListener("click", function () {
              this.map.openInfoWindow(infoWindow, point); //开启信息窗口
            });

            this.map.addOverlay(marker);
            marker.addEventListener("dragend", function (e) {
              point = new BMap.Point(e.point.lng, e.point.lat);
              alert("当前位置：" + e.point.lng + ", " + e.point.lat);
            });
          }
        }, {
          key: 'addNode',
          value: function addNode(BMap) {
            var _this2 = this;

            var p1 = new BMap.Point(114.025125, 22.547656);
            var p2 = new BMap.Point(114.05732, 22.516009);
            var driving = new BMap.DrivingRoute(this.map, {
              renderOptions: { map: this.map, autoViewport: true }
            });
            driving.search(p1, p2);

            setTimeout(function () {
              var list = _this2.data;
              var pointArray = [];
              for (var i in list) {
                var point = new BMap.Point(list[i].locationLongitude, list[i].locationLatitude);
                _this2.addMarker(point, BMap, list[i]);
              }
            }, 500);
          }
        }, {
          key: 'filterEmptyAndZeroValues',
          value: function filterEmptyAndZeroValues(data) {
            var _this3 = this;

            return _.filter(data, function (o) {
              return !(_this3.panel.hideEmpty && _.isNil(o.value)) && !(_this3.panel.hideZero && o.value === 0);
            });
          }
        }, {
          key: 'onDataSnapshotLoad',
          value: function onDataSnapshotLoad(snapshotData) {
            this.onDataReceived(snapshotData);
          }
        }, {
          key: 'seriesHandler',
          value: function seriesHandler(seriesData) {
            var series = new TimeSeries({
              datapoints: seriesData.datapoints,
              alias: seriesData.target
            });

            series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
            return series;
          }
        }, {
          key: 'setNewMapCenter',
          value: function setNewMapCenter() {
            this.render();
          }
        }, {
          key: 'setZoom',
          value: function setZoom() {
            this.map.setZoom(parseInt(this.panel.initialZoom, 10) || 1);
          }
        }, {
          key: 'setStyle',
          value: function setStyle() {
            this.map.setMapStyle({ style: this.panel.theme });
          }
        }, {
          key: 'setAK',
          value: function setAK() {
            var x = document.body;
            var s = document.getElementsByTagName("script");
            var len = s.length;
            x.removeChild(s[len - 1]);
            delete this.map;
            this.render();
          }
        }, {
          key: 'navigationControl',
          value: function navigationControl() {
            if (this.panel.navigation == true) {
              this.map.addControl(this.navigationSwitch);
            } else {
              this.map.removeControl(this.navigationSwitch);
            }
          }
        }, {
          key: 'scaleControl',
          value: function scaleControl() {
            if (this.panel.scale == true) {
              this.map.addControl(this.scaleSwitch);
            } else {
              this.map.removeControl(this.scaleSwitch);
            }
          }
        }, {
          key: 'overviewMapControl',
          value: function overviewMapControl() {
            if (this.panel.overviewMap == true) {
              this.map.addControl(this.overviewMapSwitch);
            } else {
              this.map.removeControl(this.overviewMapSwitch);
            }
          }
        }, {
          key: 'mapTypeControl',
          value: function mapTypeControl() {
            if (this.panel.mapType == true) {
              this.map.addControl(this.mapTypeSwitch);
            } else {
              this.map.removeControl(this.mapTypeSwitch);
            }
          }
        }, {
          key: 'resize',
          value: function resize() {}
        }, {
          key: 'toggleStickyLabels',
          value: function toggleStickyLabels() {
            console.log(this.panel.stickyLabels);
          }
        }, {
          key: 'changeLocationData',
          value: function changeLocationData() {
            if (this.panel.locationData === 'geohash') {
              this.render();
            }
          }
        }, {
          key: 'link',
          value: function link(scope, elem, attrs, ctrl) {
            mapRenderer(scope, elem, attrs, ctrl);
          }
        }]);

        return BaidumapCtrl;
      }(MetricsPanelCtrl);

      _export('default', BaidumapCtrl);

      BaidumapCtrl.templateUrl = 'module.html';
    }
  };
});
//# sourceMappingURL=baidumap_ctrl.js.map
