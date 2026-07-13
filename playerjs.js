(function(global) {
  if (typeof document !== 'undefined') {
    try {
      if (!document.body) {
        Object.defineProperty(document, 'body', {
          get: function() {
            let b = document.getElementsByTagName('body')[0];
            if (!b && document.documentElement) {
              b = document.createElement('body');
              document.documentElement.appendChild(b);
            }
            return b;
          },
          configurable: true
        });
      }
    } catch (e) {}
  }

  const dummyObj = function() { return dummyObj; };

  const methods = {
    api: function() { return dummyObj; },
    on: function() { return dummyObj; },
    emit: function() { return dummyObj; },
    addListener: function() { return dummyObj; },
    off: function() { return dummyObj; },
    play: function() { return dummyObj; },
    pause: function() { return dummyObj; },
    getVolume: function() { return 1; },
    setVolume: function() { return dummyObj; },
    getCurrentTime: function() { return 0; },
    getDuration: function() { return 0; },
    setCurrentTime: function() { return dummyObj; },
    version: '1.0.0'
  };

  for (let key in methods) {
    dummyObj[key] = methods[key];
  }

  let proxyDummy = dummyObj;
  if (typeof Proxy !== 'undefined') {
    proxyDummy = new Proxy(dummyObj, {
      get: function(target, prop) {
        if (prop in target) {
          return target[prop];
        }
        return function() { return proxyDummy; };
      },
      apply: function(target, thisArg, argumentsList) {
        return proxyDummy;
      }
    });
  }

  function PlayerjsConstructor(config) {
    return proxyDummy;
  }

  for (let key in methods) {
    PlayerjsConstructor[key] = proxyDummy;
  }

  PlayerjsConstructor.Playerjs = PlayerjsConstructor;
  PlayerjsConstructor.Emitter = function() { return proxyDummy; };
  PlayerjsConstructor.emit = proxyDummy.emit;
  PlayerjsConstructor.addListener = proxyDummy.addListener;
  PlayerjsConstructor.on = proxyDummy.on;
  PlayerjsConstructor.api = proxyDummy.api;

  global.Playerjs = global.Playerjs || PlayerjsConstructor;

  if (!global.playerjs || (typeof global.playerjs !== 'object' && typeof global.playerjs !== 'function')) {
    global.playerjs = {};
  }

  for (let key in methods) {
    global.playerjs[key] = proxyDummy;
  }
  global.playerjs.Playerjs = global.Playerjs;
  global.playerjs.Emitter = function() { return proxyDummy; };
  global.playerjs.emit = proxyDummy.emit;
  global.playerjs.addListener = proxyDummy.addListener;
  global.playerjs.on = proxyDummy.on;
  global.playerjs.api = proxyDummy.api;

})(typeof window !== 'undefined' ? window : globalThis);

