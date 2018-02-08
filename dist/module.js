"use strict";

System.register(["./baidumap_ctrl"], function (_export, _context) {
  "use strict";

  var BaidumapCtrl;
  return {
    setters: [function (_baidumap_ctrl) {
      BaidumapCtrl = _baidumap_ctrl.default;
    }],
    execute: function () {

      loadPluginCss({
        dark: "plugins/grafana-baidumap-panel/css/baidumap.dark.css",
        light: "plugins/grafana-baidumap-panel/css/baidumap.light.css"
      });

      /* eslint import/prefer-default-export: 0 */
      /* eslint import/no-extraneous-dependencies: 0 */

      _export("PanelCtrl", BaidumapCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
