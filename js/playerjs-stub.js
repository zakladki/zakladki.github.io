(function() {
  const dummy = function() { return dummy; };
  dummy.emit = function() { return dummy; };
  dummy.addListener = function() { return dummy; };
  dummy.on = function() { return dummy; };
  dummy.off = function() { return dummy; };
  dummy.api = function() { return dummy; };
  dummy.play = function() { return dummy; };
  dummy.pause = function() { return dummy; };
  dummy.getVolume = function() { return 1; };
  dummy.setVolume = function() { return dummy; };
  dummy.getCurrentTime = function() { return 0; };
  dummy.getDuration = function() { return 0; };
  dummy.setCurrentTime = function() { return dummy; };
  dummy.Playerjs = dummy;
  dummy.Emitter = dummy;

  let proxy = dummy;
  if (typeof Proxy !== 'undefined') {
    proxy = new Proxy(dummy, {
      get: function(target, prop) {
        if (prop in target) return target[prop];
        return dummy;
      },
      apply: function(target, thisArg, argList) {
        return dummy;
      },
      construct: function(target, argList) {
        return dummy;
      }
    });
  }

  window.playerjs = proxy;
  window.Playerjs = proxy;
  try {
    globalThis.playerjs = proxy;
    globalThis.Playerjs = proxy;
  } catch(e) {}
})();
