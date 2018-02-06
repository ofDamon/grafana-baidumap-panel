'use strict';

System.register(['app/plugins/sdk', './baidumap_ctrl'], function (_export, _context) {
  "use strict";

  var loadPluginCss, BaidumapCtrl;
  return {
    setters: [function (_appPluginsSdk) {
      loadPluginCss = _appPluginsSdk.loadPluginCss;
    }, function (_baidumap_ctrl) {
      BaidumapCtrl = _baidumap_ctrl.default;
    }],
    execute: function () {
      /* eslint import/no-extraneous-dependencies: 0 */
      loadPluginCss({
        dark: "plugins/grafana-baidumap-panel/css/worldmap.dark.css",
        light: "plugins/grafana-baidumap-panel/css/worldmap.light.css"
      });

      /* eslint import/prefer-default-export: 0 */

      _export('PanelCtrl', BaidumapCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
