/* eslint import/no-extraneous-dependencies: 0 */
import {loadPluginCss} from 'app/plugins/sdk';
import BaidumapCtrl from './baidumap_ctrl';

loadPluginCss({
  dark: "plugins/grafana-baidumap-panel/css/worldmap.dark.css",
  light: "plugins/grafana-baidumap-panel/css/worldmap.light.css"
});

/* eslint import/prefer-default-export: 0 */
export {
  BaidumapCtrl as PanelCtrl
};
