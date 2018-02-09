/* eslint import/no-extraneous-dependencies: 0 */
import BaidumapCtrl from './baidumap_ctrl';
import { loadPluginCss } from "app/plugins/sdk";

loadPluginCss({
  dark: "plugins/grafana-baidumap-panel/css/baidumap.dark.css",
  light: "plugins/grafana-baidumap-panel/css/baidumap.light.css"
});

/* eslint import/prefer-default-export: 0 */
export {
  BaidumapCtrl as PanelCtrl
};
