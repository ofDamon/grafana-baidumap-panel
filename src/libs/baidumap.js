export function MP(ak) {
  return new Promise((resolve, reject) => {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://api.map.baidu.com/api?v=2.0&ak=" + ak + "&callback=init";
    script.onerror = reject;
    document.head.appendChild(script);
    setTimeout(() => {
        resolve(BMap);
    }, 500);
  });
  
}
