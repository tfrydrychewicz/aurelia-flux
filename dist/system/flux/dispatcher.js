System.register(['aurelia-framework'], function (_export) {
  'use strict';

  var instanceActivator, FluxDispatcher, Dispatcher;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaFramework) {
      instanceActivator = _aureliaFramework.instanceActivator;
    }],
    execute: function () {
      FluxDispatcher = (function () {
        function FluxDispatcher() {
          _classCallCheck(this, FluxDispatcher);
        }

        FluxDispatcher.prototype.dispatch = function dispatch() {};

        _createClass(FluxDispatcher, null, [{
          key: 'instance',
          value: new FluxDispatcher(),
          enumerable: true
        }]);

        return FluxDispatcher;
      })();

      _export('FluxDispatcher', FluxDispatcher);

      Dispatcher = (function () {
        function Dispatcher() {
          _classCallCheck(this, Dispatcher);
        }

        Dispatcher.prototype.setInstance = function setInstance(instance) {
          this.instance = instance;
        };

        Dispatcher.prototype.listenTo = function listenTo(patterns, handler) {};

        Dispatcher.prototype.waitFor = function waitFor(type, handler) {};

        return Dispatcher;
      })();

      _export('Dispatcher', Dispatcher);
    }
  };
});