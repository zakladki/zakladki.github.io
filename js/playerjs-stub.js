(function() {
  const dummyFunc = function() { return dummyFunc; };
  dummyFunc.emit = function() { return dummyFunc; };
  dummyFunc.addListener = function() { return dummyFunc; };
  dummyFunc.on = function() { return dummyFunc; };
  dummyFunc.off = function() { return dummyFunc; };
  dummyFunc.api = function() { return dummyFunc; };
  dummyFunc.play = function() { return dummyFunc; };
  dummyFunc.pause = function() { return dummyFunc; };
  dummyFunc.getVolume = function() { return 1; };
  dummyFunc.setVolume = function() { return dummyFunc; };
  dummyFunc.getCurrentTime = function() { return 0; };
  dummyFunc.getDuration = function() { return 0; };
  dummyFunc.setCurrentTime = function() { return dummyFunc; };
  dummyFunc.Playerjs = dummyFunc;
  dummyFunc.Emitter = dummyFunc;

  let proxyObj = dummyFunc;
  if (typeof Proxy !== 'undefined') {
    proxyObj = new Proxy(dummyFunc, {
      get: function(target, prop) {
        if (prop in target) {
          return target[prop];
        }
        return dummyFunc;
      },
      apply: function(target, thisArg, argumentsList) {
        return dummyFunc;
      },
      construct: function(target, argumentsList) {
        return dummyFunc;
      }
    });
  }

  window.playerjs = proxyObj;
  window.Playerjs = proxyObj;
  window.emit = proxyObj.emit;
  window.addListener = proxyObj.addListener;

  try {
    globalThis.playerjs = proxyObj;
    globalThis.Playerjs = proxyObj;
  } catch (e) {}
})();
