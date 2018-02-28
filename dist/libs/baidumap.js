"use strict";

System.register([], function (_export, _context) {
  "use strict";

  function MP(ak) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "http://api.map.baidu.com/api?v=2.0&ak=" + ak + "&callback=init";
      script.onerror = reject;
      document.head.appendChild(script);

      setTimeout(function () {

        resolve(BMap);
      }, 500);
    });
  }

  _export("MP", MP);

  return {
    setters: [],
    execute: function () {}
  };
});
//# sourceMappingURL=baidumap.js.map
