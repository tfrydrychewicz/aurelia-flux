System.register([], function (_export) {
  "use strict";

  var FluxMetadata, FluxMethodMetadata;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [],
    execute: function () {
      FluxMetadata = function FluxMetadata() {
        _classCallCheck(this, FluxMetadata);

        this.methods = new Map();
      };

      _export("FluxMetadata", FluxMetadata);

      FluxMethodMetadata = function FluxMethodMetadata() {
        _classCallCheck(this, FluxMethodMetadata);
      };

      _export("FluxMethodMetadata", FluxMethodMetadata);
    }
  };
});