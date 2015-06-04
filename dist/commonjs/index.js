'use strict';

exports.__esModule = true;
exports.configure = configure;

var _lifecycleManager = require('./lifecycle-manager');

var _instanceDispatcher = require('./instance-dispatcher');

exports.Dispatcher = _instanceDispatcher.Dispatcher;

var _decoratorsHandle = require('./decorators/handle');

exports.handle = _decoratorsHandle.handle;

var _decoratorsWaitFor = require('./decorators/waitFor');

exports.waitFor = _decoratorsWaitFor.waitFor;

function configure(aurelia, configCallback) {
  _lifecycleManager.LifecycleManager.interceptClassActivator();
}