// Заглушка для плеєра, щоб прибрати помилки сервера
(function(global) {
  var dummy = {
    emit: function() { return this; },
    addListener: function() { return this; },
    on: function() { return this; },
    api: function() { return this; }
  };
  global.Playerjs = global.Playerjs || function() { return dummy; };
  global.playerjs = global.playerjs || dummy;
})(typeof window !== 'undefined' ? window : global);