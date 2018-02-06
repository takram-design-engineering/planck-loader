(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Planck = global.Planck || {})));
}(this, (function (exports) { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};









var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var _cachedApplicationRef = Symbol('_cachedApplicationRef');
var _mixinRef = Symbol('_mixinRef');
var _originalMixin = Symbol('_originalMixin');

/**
 * Sets the prototype of mixin to wrapper so that properties set on mixin are
 * inherited by the wrapper.
 *
 * This is needed in order to implement @@hasInstance as a decorator function.
 */
var wrap = function wrap(mixin, wrapper) {
  Object.setPrototypeOf(wrapper, mixin);
  if (!mixin[_originalMixin]) {
    mixin[_originalMixin] = mixin;
  }
  return wrapper;
};

/**
 * Decorates mixin so that it caches its applications. When applied multiple
 * times to the same superclass, mixin will only create one subclass and
 * memoize it.
 */
var Cached = function Cached(mixin) {
  return wrap(mixin, function (superclass) {
    // Get or create a symbol used to look up a previous application of mixin
    // to the class. This symbol is unique per mixin definition, so a class will have N
    // applicationRefs if it has had N mixins applied to it. A mixin will have
    // exactly one _cachedApplicationRef used to store its applications.
    var applicationRef = mixin[_cachedApplicationRef];
    if (!applicationRef) {
      applicationRef = mixin[_cachedApplicationRef] = Symbol(mixin.name);
    }
    // Look up an existing application of `mixin` to `c`, return it if found.
    if (superclass.hasOwnProperty(applicationRef)) {
      return superclass[applicationRef];
    }
    // Apply the mixin
    var application = mixin(superclass);
    // Cache the mixin application on the superclass
    superclass[applicationRef] = application;
    return application;
  });
};

/**
 * Adds @@hasInstance (ES2015 instanceof support) to mixin.
 * Note: @@hasInstance is not supported in any browsers yet.
 */
var HasInstance = function HasInstance(mixin) {
  if (Symbol.hasInstance && !mixin.hasOwnProperty(Symbol.hasInstance)) {
    Object.defineProperty(mixin, Symbol.hasInstance, {
      value: function value(o) {
        var originalMixin = this[_originalMixin];
        while (o != null) {
          if (o.hasOwnProperty(_mixinRef) && o[_mixinRef] === originalMixin) {
            return true;
          }
          o = Object.getPrototypeOf(o);
        }
        return false;
      }
    });
  }
  return mixin;
};

/**
 * A basic mixin decorator that sets up a reference from mixin applications
 * to the mixin defintion for use by other mixin decorators.
 */
var BareMixin = function BareMixin(mixin) {
  return wrap(mixin, function (superclass) {
    // Apply the mixin
    var application = mixin(superclass);

    // Attach a reference from mixin applition to wrapped mixin for RTTI
    // mixin[@@hasInstance] should use this.
    application.prototype[_mixinRef] = mixin[_originalMixin];
    return application;
  });
};

/**
 * Decorates a mixin function to add application caching and instanceof
 * support.
 */
var Mixin = function Mixin(mixin) {
  return Cached(HasInstance(BareMixin(mixin)));
};

var mix = function mix(superClass) {
  return new MixinBuilder(superClass);
};

var MixinBuilder = function () {
  function MixinBuilder(superclass) {
    classCallCheck(this, MixinBuilder);

    this.superclass = superclass;
  }

  createClass(MixinBuilder, [{
    key: 'with',
    value: function _with() {
      return Array.from(arguments).reduce(function (c, m) {
        return m(c);
      }, this.superclass);
    }
  }]);
  return MixinBuilder;
}();

// The MIT License
// Copyright (C) 2016-Present Shota Matsuda

function createNamespace() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

  var symbol = Symbol(name);
  return function namespace(object) {
    var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (data) {
      return data;
    };

    if (object[symbol] === undefined) {
      // eslint-disable-next-line no-param-reassign
      object[symbol] = init({});
    }
    return object[symbol];
  };
}

// The MIT License
// Copyright (C) 2016-Present Shota Matsuda

var isBrowser = function () {
  try {
    // eslint-disable-next-line no-new-func
    if (new Function('return this === window')()) {
      return true;
    }
  } catch (error) {}
  return false;
}();

var isWorker = !isBrowser && function () {
  try {
    // eslint-disable-next-line no-new-func
    if (new Function('return this === self')()) {
      return true;
    }
  } catch (error) {}
  return false;
}();

var isNode = !isBrowser && !isWorker && function () {
  try {
    // eslint-disable-next-line no-new-func
    if (new Function('return this === global')()) {
      return true;
    }
  } catch (error) {}
  return false;
}();

var globalScope = function () {
  if (isBrowser) {
    return window;
  }
  if (isWorker) {
    // eslint-disable-next-line no-restricted-globals
    return self;
  }
  if (isNode) {
    return global;
  }
  return undefined;
}();

var Global = {
  isBrowser: isBrowser,
  isWorker: isWorker,
  isNode: isNode,
  scope: globalScope
};

// The MIT License
// Copyright (C) 2016-Present Shota Matsuda

var internal = createNamespace('Event');

var Event = function () {
  function Event() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, Event);

    this.init(options);
  }

  createClass(Event, [{
    key: 'init',
    value: function init() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          type = _ref.type,
          _ref$captures = _ref.captures,
          captures = _ref$captures === undefined ? false : _ref$captures,
          _ref$bubbles = _ref.bubbles,
          bubbles = _ref$bubbles === undefined ? true : _ref$bubbles,
          _ref$cancelable = _ref.cancelable,
          cancelable = _ref$cancelable === undefined ? true : _ref$cancelable;

      var scope = internal(this);
      scope.type = type !== undefined ? type : null;
      scope.captures = !!captures;
      scope.bubbles = !!bubbles;
      scope.cancelable = !!cancelable;
      scope.timeStamp = Global.scope.performance && Global.scope.performance.now && Global.scope.performance.now() || Date.now();
      scope.propagationStopped = false;
      scope.immediatePropagationStopped = false;
      scope.defaultPrevented = false;
      scope.target = null;
      scope.currentTarget = null;
      scope.eventPhase = null;
      return this;
    }
  }, {
    key: 'stopPropagation',
    value: function stopPropagation() {
      var scope = internal(this);
      scope.propagationStopped = true;
    }
  }, {
    key: 'stopImmediatePropagation',
    value: function stopImmediatePropagation() {
      var scope = internal(this);
      scope.propagationStopped = true;
      scope.immediatePropagationStopped = true;
    }
  }, {
    key: 'preventDefault',
    value: function preventDefault() {
      if (this.cancelable) {
        var scope = internal(this);
        scope.defaultPrevented = true;
      }
    }
  }, {
    key: 'type',
    get: function get$$1() {
      var scope = internal(this);
      return scope.type;
    }
  }, {
    key: 'target',
    get: function get$$1() {
      var scope = internal(this);
      return scope.target;
    }
  }, {
    key: 'currentTarget',
    get: function get$$1() {
      var scope = internal(this);
      return scope.currentTarget;
    }
  }, {
    key: 'eventPhase',
    get: function get$$1() {
      var scope = internal(this);
      return scope.eventPhase;
    }
  }, {
    key: 'captures',
    get: function get$$1() {
      var scope = internal(this);
      return scope.captures;
    }
  }, {
    key: 'bubbles',
    get: function get$$1() {
      var scope = internal(this);
      return scope.bubbles;
    }
  }, {
    key: 'cancelable',
    get: function get$$1() {
      var scope = internal(this);
      return scope.cancelable;
    }
  }, {
    key: 'timeStamp',
    get: function get$$1() {
      var scope = internal(this);
      return scope.timeStamp;
    }
  }, {
    key: 'propagationStopped',
    get: function get$$1() {
      var scope = internal(this);
      return scope.propagationStopped;
    }
  }, {
    key: 'immediatePropagationStopped',
    get: function get$$1() {
      var scope = internal(this);
      return scope.immediatePropagationStopped;
    }
  }, {
    key: 'defaultPrevented',
    get: function get$$1() {
      var scope = internal(this);
      return scope.defaultPrevented;
    }
  }]);
  return Event;
}();

function modifyEvent(event) {
  var scope = internal(event);
  return {
    set target(value) {
      scope.target = value !== undefined ? value : null;
    },

    set currentTarget(value) {
      scope.currentTarget = value !== undefined ? value : null;
    },

    set eventPhase(value) {
      scope.eventPhase = value !== undefined ? value : null;
    }
  };
}

// The MIT License
// Copyright (C) 2016-Present Shota Matsuda

var CustomEvent = function (_Event) {
  inherits(CustomEvent, _Event);

  function CustomEvent() {
    classCallCheck(this, CustomEvent);
    return possibleConstructorReturn(this, (CustomEvent.__proto__ || Object.getPrototypeOf(CustomEvent)).apply(this, arguments));
  }

  createClass(CustomEvent, [{
    key: 'init',
    value: function init() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var type = _ref.type,
          target = _ref.target,
          rest = objectWithoutProperties(_ref, ['type', 'target']);

      get(CustomEvent.prototype.__proto__ || Object.getPrototypeOf(CustomEvent.prototype), 'init', this).call(this, _extends({ type: type }, rest));
      // Support target as a parameter
      modifyEvent(this).target = target !== undefined ? target : null;
      return this;
    }
  }]);
  return CustomEvent;
}(Event);

// The MIT License
// Copyright (C) 2016-Present Shota Matsuda

var GenericEvent = function (_CustomEvent) {
  inherits(GenericEvent, _CustomEvent);

  function GenericEvent() {
    classCallCheck(this, GenericEvent);
    return possibleConstructorReturn(this, (GenericEvent.__proto__ || Object.getPrototypeOf(GenericEvent)).apply(this, arguments));
  }

  createClass(GenericEvent, [{
    key: 'init',
    value: function init() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var type = _ref.type,
          target = _ref.target,
          _ref$captures = _ref.captures,
          captures = _ref$captures === undefined ? false : _ref$captures,
          _ref$bubbles = _ref.bubbles,
          bubbles = _ref$bubbles === undefined ? false : _ref$bubbles,
          rest = objectWithoutProperties(_ref, ['type', 'target', 'captures', 'bubbles']);

      get(GenericEvent.prototype.__proto__ || Object.getPrototypeOf(GenericEvent.prototype), 'init', this).call(this, {
        type: type, target: target, captures: captures, bubbles: bubbles
      });
      var names = Object.keys(rest);
      for (var i = 0; i < names.length; ++i) {
        var name = names[i];
        if (!{}.hasOwnProperty.call(this, name)) {
          this[name] = rest[name];
        } else {
          throw new Error('Name "' + name + '" cannot be used for event property');
        }
      }
      return this;
    }
  }]);
  return GenericEvent;
}(CustomEvent);

// The MIT License
// Copyright (C) 2016-Present Shota Matsuda

var internal$1 = createNamespace('EventDispatcherMixin');

function handleEvent(event, listener) {
  if (typeof listener === 'function') {
    listener(event);
  } else if (typeof listener.handleEvent === 'function') {
    listener.handleEvent(event);
  } else {
    throw new Error('Listener is neither function nor event listener');
  }
}

// eslint-disable-next-line arrow-parens
var EventDispatcherMixin = Mixin(function (S) {
  return function (_S) {
    inherits(EventDispatcherMixin, _S);

    function EventDispatcherMixin() {
      var _ref;

      classCallCheck(this, EventDispatcherMixin);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _this = possibleConstructorReturn(this, (_ref = EventDispatcherMixin.__proto__ || Object.getPrototypeOf(EventDispatcherMixin)).call.apply(_ref, [this].concat(args)));

      var scope = internal$1(_this);
      scope.listeners = {};
      return _this;
    }

    createClass(EventDispatcherMixin, [{
      key: 'addEventListener',
      value: function addEventListener(type, listener) {
        var capture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if (typeof listener !== 'function' && (typeof listener === 'undefined' ? 'undefined' : _typeof(listener)) !== 'object') {
          throw new Error('Attempt to add non-function non-object listener');
        }
        var scope = internal$1(this);
        if (scope.listeners[type] === undefined) {
          scope.listeners[type] = { bubble: [], capture: [] };
        }
        var listeners = capture ? scope.listeners[type].capture : scope.listeners[type].bubble;
        if (listeners.includes(listener)) {
          return;
        }
        listeners.push(listener);
      }
    }, {
      key: 'removeEventListener',
      value: function removeEventListener(type, listener) {
        var capture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var scope = internal$1(this);
        if (scope.listeners[type] === undefined) {
          return;
        }
        var listeners = capture ? scope.listeners[type].capture : scope.listeners[type].bubble;
        var index = listeners.indexOf(listener);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      }
    }, {
      key: 'on',
      value: function on() {
        this.addEventListener.apply(this, arguments);
        return this;
      }
    }, {
      key: 'off',
      value: function off() {
        this.removeEventListener.apply(this, arguments);
        return this;
      }
    }, {
      key: 'once',
      value: function once(type, listener) {
        for (var _len2 = arguments.length, rest = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          rest[_key2 - 2] = arguments[_key2];
        }

        var _this2 = this;

        var delegate = function delegate(event) {
          handleEvent(event, listener);
          _this2.removeEventListener.apply(_this2, [type, delegate].concat(rest));
        };
        this.addEventListener.apply(this, [type, delegate].concat(rest));
        return this;
      }
    }, {
      key: 'dispatchEvent',
      value: function dispatchEvent(object) {
        var event = object;
        if (!(event instanceof Event)) {
          event = new GenericEvent(object);
        }
        var modifier = modifyEvent(event);

        // Set target to this when it's not set
        if (event.target === null) {
          modifier.target = this;
        }
        // Current target should be always this
        modifier.currentTarget = this;

        var scope = internal$1(this);
        var listeners = scope.listeners[event.type];
        if (listeners === undefined) {
          return;
        }
        var _event = event,
            eventPhase = _event.eventPhase;

        if (!eventPhase || eventPhase === 'target' || eventPhase === 'capture') {
          var capture = [].concat(toConsumableArray(listeners.capture));
          for (var i = 0; i < capture.length; ++i) {
            handleEvent(event, capture[i]);
            if (event.immediatePropagationStopped) {
              return;
            }
          }
        }
        if (!eventPhase || eventPhase === 'target' || eventPhase === 'bubble') {
          var bubble = [].concat(toConsumableArray(listeners.bubble));
          for (var _i = 0; _i < bubble.length; ++_i) {
            handleEvent(event, bubble[_i]);
            if (event.immediatePropagationStopped) {
              return;
            }
          }
        }
      }
    }]);
    return EventDispatcherMixin;
  }(S);
});

// The MIT License
// Copyright (C) 2016-Present Shota Matsuda

var EventDispatcher = function (_mix$with) {
  inherits(EventDispatcher, _mix$with);

  function EventDispatcher() {
    classCallCheck(this, EventDispatcher);
    return possibleConstructorReturn(this, (EventDispatcher.__proto__ || Object.getPrototypeOf(EventDispatcher)).apply(this, arguments));
  }

  return EventDispatcher;
}(mix(function () {
  function _class() {
    classCallCheck(this, _class);
  }

  return _class;
}()).with(EventDispatcherMixin));

// The MIT License
// Copyright (C) 2017-Present Shota Matsuda

var internal$2 = createNamespace('DataLoader');

function setSize(target, value) {
  var scope = internal$2(target);
  if (value !== scope.size) {
    scope.size = value;
    target.dispatchEvent({ type: 'size' });
  }
}

function setProgress(target, value) {
  var scope = internal$2(target);
  if (value !== scope.progress) {
    scope.progress = value;
    target.dispatchEvent({ type: 'progress' });
  }
}

function setDeterminate(target, value) {
  var scope = internal$2(target);
  if (value !== scope.determinate) {
    scope.determinate = value;
    target.dispatchEvent({ type: 'determinate' });
  }
}

var DataLoader = function (_EventDispatcher) {
  inherits(DataLoader, _EventDispatcher);

  function DataLoader(target) {
    classCallCheck(this, DataLoader);

    // Intiial states
    var _this = possibleConstructorReturn(this, (DataLoader.__proto__ || Object.getPrototypeOf(DataLoader)).call(this));

    var scope = internal$2(_this);
    scope.request = null;
    if (target !== undefined) {
      scope.url = target.url || target;
      scope.size = target.size || 0;
    } else {
      scope.url = null;
      scope.size = 0;
    }
    scope.progress = 0;
    scope.determinate = false;
    scope.completed = false;
    scope.failed = false;

    // Event handlers
    _this.onInitialProgress = _this.onInitialProgress.bind(_this);
    _this.onProgress = _this.onProgress.bind(_this);
    _this.onLoadend = _this.onLoadend.bind(_this);
    return _this;
  }

  createClass(DataLoader, [{
    key: 'load',
    value: function load() {
      var _this2 = this;

      var scope = internal$2(this);
      if (scope.promise !== undefined) {
        return scope.promise;
      }
      if (this.url === null) {
        return Promise.reject(new Error('Attempt to load without url'));
      }
      scope.promise = new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.addEventListener('progress', _this2.onInitialProgress, false);
        request.addEventListener('progress', _this2.onProgress, false);
        request.addEventListener('loadend', _this2.onLoadend, false);
        request.open('get', _this2.url);
        scope.request = request;
        scope.resolve = resolve;
        scope.reject = reject;

        // TODO: Support promise return values
        _this2.onBeforeLoading(request);
        request.send();
      });
      return scope.promise;
    }
  }, {
    key: 'abort',
    value: function abort() {
      var scope = internal$2(this);
      if (scope.promise === undefined) {
        return;
      }
      scope.request.abort();
    }
  }, {
    key: 'onInitialProgress',
    value: function onInitialProgress(event) {
      var scope = internal$2(this);
      var request = event.target;
      request.removeEventListener('progress', this.onInitialProgress, false);
      if (request.status < 200 || request.status >= 300) {
        return;
      }
      if (scope.size === 0) {
        if (event.lengthComputable) {
          setSize(this, event.total);
        } else {
          var size = request.getResponseHeader('X-Decompressed-Content-Length');
          setSize(this, +size || 0);
        }
      }
      if (scope.size !== 0) {
        setDeterminate(this, true);
      }
    }
  }, {
    key: 'onProgress',
    value: function onProgress(event) {
      var scope = internal$2(this);
      if (scope.determinate) {
        setProgress(this, Math.min(1, event.loaded / scope.size));
      }
    }
  }, {
    key: 'onLoadend',
    value: function onLoadend(event) {
      var _this3 = this;

      var scope = internal$2(this);
      var request = event.target;
      request.removeEventListener('progress', this.onInitialProgress, false);
      request.removeEventListener('progress', this.onProgress, false);
      request.removeEventListener('loadend', this.onLoadend, false);
      if (!scope.determinate) {
        setDeterminate(this, true);
      }
      if (request.status >= 200 && request.status < 300) {
        setProgress(this, 1);
        Promise.resolve(this.onAfterLoading(request)).then(function () {
          scope.completed = true;
          scope.resolve(request);
          _this3.dispatchEvent({ type: 'complete' });
        }).catch(function (error) {
          scope.failed = true;
          scope.reject(error);
          _this3.dispatchEvent({ type: 'error' });
        });
      } else {
        scope.failed = true;
        scope.reject(request.status);
        this.dispatchEvent({ type: 'error' });
      }
    }
  }, {
    key: 'onBeforeLoading',
    value: function onBeforeLoading(request) {}
  }, {
    key: 'onAfterLoading',
    value: function onAfterLoading(request) {}
  }, {
    key: 'request',
    get: function get$$1() {
      var scope = internal$2(this);
      return scope.request;
    }
  }, {
    key: 'url',
    get: function get$$1() {
      var scope = internal$2(this);
      return scope.url;
    }
  }, {
    key: 'size',
    get: function get$$1() {
      var scope = internal$2(this);
      return scope.size;
    }
  }, {
    key: 'progress',
    get: function get$$1() {
      var scope = internal$2(this);
      return scope.progress;
    }
  }, {
    key: 'determinate',
    get: function get$$1() {
      var scope = internal$2(this);
      return scope.determinate;
    }
  }, {
    key: 'completed',
    get: function get$$1() {
      var scope = internal$2(this);
      return scope.completed;
    }
  }, {
    key: 'failed',
    get: function get$$1() {
      var scope = internal$2(this);
      return scope.failed;
    }
  }]);
  return DataLoader;
}(EventDispatcher);

// The MIT License
// Copyright (C) 2017-Present Shota Matsuda

var ScriptLoader = function (_DataLoader) {
  inherits(ScriptLoader, _DataLoader);

  function ScriptLoader() {
    classCallCheck(this, ScriptLoader);
    return possibleConstructorReturn(this, (ScriptLoader.__proto__ || Object.getPrototypeOf(ScriptLoader)).apply(this, arguments));
  }

  createClass(ScriptLoader, [{
    key: 'onAfterLoading',
    value: function onAfterLoading(request) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = _this2.url;
        script.onload = function () {
          resolve();
        };
        script.onerror = function (error) {
          reject(error);
        };
        var scripts = document.getElementsByTagName('script');
        var target = scripts[scripts.length - 1];
        target.parentNode.insertBefore(script, target);
      });
    }
  }]);
  return ScriptLoader;
}(DataLoader);

// The MIT License
// Copyright (C) 2017-Present Shota Matsuda

var internal$3 = createNamespace('Loader');

function construct(entries) {
  return entries.map(function (entry) {
    if (Array.isArray(entry)) {
      return construct(entry);
    }
    if (entry && typeof entry.load === 'function') {
      return entry;
    }
    var url = entry.url || entry;
    if (url.endsWith('.js')) {
      return new ScriptLoader(entry);
    }
    return new DataLoader(entry);
  });
}

function expand(entries) {
  return entries.reduce(function (loaders, entry) {
    if (Array.isArray(entry)) {
      return loaders.concat(expand(entry));
    }
    loaders.push(entry);
    return loaders;
  }, []);
}

var Loader = function (_EventDispatcher) {
  inherits(Loader, _EventDispatcher);

  function Loader() {
    classCallCheck(this, Loader);

    // Initial states
    var _this = possibleConstructorReturn(this, (Loader.__proto__ || Object.getPrototypeOf(Loader)).call(this));

    var scope = internal$3(_this);
    scope.determinate = false;
    scope.completed = false;
    scope.failed = false;

    // Event handlers
    _this.onSize = _this.onSize.bind(_this);
    _this.onProgress = _this.onProgress.bind(_this);
    _this.onDeterminate = _this.onDeterminate.bind(_this);
    _this.onComplete = _this.onComplete.bind(_this);
    _this.onError = _this.onError.bind(_this);

    for (var _len = arguments.length, sequence = Array(_len), _key = 0; _key < _len; _key++) {
      sequence[_key] = arguments[_key];
    }

    scope.sequence = construct(sequence);
    scope.loaders = expand(scope.sequence);
    scope.loaders.forEach(function (loader) {
      loader.addEventListener('size', _this.onSize, false);
      loader.addEventListener('progress', _this.onProgress, false);
      loader.addEventListener('determinate', _this.onDeterminate, false);
      loader.addEventListener('complete', _this.onComplete, false);
      loader.addEventListener('error', _this.onError, false);
    });
    return _this;
  }

  createClass(Loader, [{
    key: 'load',
    value: function load() {
      var scope = internal$3(this);
      if (scope.promise !== undefined) {
        return scope.promise;
      }
      if (this.loaders.length === 0) {
        return Promise.reject();
      }
      scope.promise = this.constructor.loadSequentially(scope.sequence);
      return scope.promise;
    }
  }, {
    key: 'abort',
    value: function abort() {
      var scope = internal$3(this);
      if (scope.promise === undefined) {
        return;
      }
      scope.loaders.forEach(function (loader) {
        loader.abort();
      });
    }
  }, {
    key: 'onSize',
    value: function onSize(event) {
      event.target.removeEventListener('size', this.onSize, false);
      this.dispatchEvent({ type: 'size' });
    }
  }, {
    key: 'onProgress',
    value: function onProgress(event) {
      this.dispatchEvent({ type: 'progress' });
    }
  }, {
    key: 'onDeterminate',
    value: function onDeterminate(event) {
      event.target.removeEventListener('determinate', this.onDeterminate, false);
      var scope = internal$3(this);
      var value = scope.loaders.every(function (loader) {
        return loader.determinate;
      });
      if (value !== scope.determinate) {
        scope.determinate = value;
        this.dispatchEvent({ type: 'determinate' });
      }
    }
  }, {
    key: 'onComplete',
    value: function onComplete(event) {
      var scope = internal$3(this);
      var value = scope.loaders.every(function (loader) {
        return loader.completed;
      });
      if (value !== scope.completed) {
        scope.completed = value;
        this.dispatchEvent({ type: 'complete' });
      }
    }
  }, {
    key: 'onError',
    value: function onError(event) {
      var scope = internal$3(this);
      var value = scope.loaders.some(function (loader) {
        return loader.failed;
      });
      if (value !== scope.failed) {
        scope.failed = value;
        this.dispatchEvent({ type: 'error' });

        // Abort all the loaders
        if (scope.failed) {
          this.abort();
        }
      }
    }
  }, {
    key: 'loaders',
    get: function get$$1() {
      var scope = internal$3(this);
      return [].concat(toConsumableArray(scope.loaders));
    }
  }, {
    key: 'size',
    get: function get$$1() {
      var scope = internal$3(this);
      return scope.loaders.reduce(function (size, loader) {
        return size + loader.size;
      }, 0);
    }
  }, {
    key: 'progress',
    get: function get$$1() {
      var scope = internal$3(this);

      // Calculate the aggregate progress by the number of loaders when the sizes
      // of all of the loaders are zero.
      if (this.size === 0) {
        return Math.min(1, scope.loaders.reduce(function (progress, loader) {
          return progress + loader.progress / scope.loaders.length;
        }, 0));
      }

      // Use the mean size of non-zero loaders for zero loaders.
      var loaders = scope.loaders.filter(function (loader) {
        return loader.size !== 0;
      });
      var mean = loaders.reduce(function (sum, loader) {
        return sum + loader.size;
      }, 0) / loaders.length;
      var total = mean * scope.loaders.length;
      return Math.min(1, scope.loaders.reduce(function (progress, loader) {
        return progress + loader.progress * (loader.size || mean) / total;
      }, 0));
    }
  }, {
    key: 'determinate',
    get: function get$$1() {
      var scope = internal$3(this);
      return scope.determinate;
    }
  }, {
    key: 'completed',
    get: function get$$1() {
      var scope = internal$3(this);
      return scope.completed;
    }
  }, {
    key: 'failed',
    get: function get$$1() {
      var scope = internal$3(this);
      return scope.failed;
    }
  }], [{
    key: 'loadParallelly',
    value: function loadParallelly(loaders) {
      var _this2 = this;

      return Promise.all(loaders.map(function (loader) {
        if (Array.isArray(loader)) {
          return _this2.loadSequentially(loader);
        }
        return loader.load().then(function (request) {
          return [].concat(request);
        });
      })).then(function (requests) {
        var _ref;

        return (_ref = []).concat.apply(_ref, toConsumableArray(requests));
      });
    }
  }, {
    key: 'loadSequentially',
    value: function loadSequentially(loaders) {
      var _this3 = this;

      if (loaders.length === 0) {
        return Promise.resolve([]);
      }
      return loaders.reduce(function (promise, loader) {
        if (promise === null) {
          if (Array.isArray(loader)) {
            return _this3.loadParallelly(loader);
          }
          return loader.load().then(function (request) {
            return [].concat(request);
          });
        }
        if (Array.isArray(loader)) {
          return promise.then(function (requests) {
            return _this3.loadParallelly(loader).then(function (request) {
              return [].concat(requests, request);
            });
          });
        }
        return promise.then(function (requests) {
          return loader.load().then(function (request) {
            return [].concat(requests, request);
          });
        });
      }, null);
    }
  }]);
  return Loader;
}(EventDispatcher);

// The MIT License
// Copyright (C) 2017-Present Shota Matsuda

exports.DataLoader = DataLoader;
exports.Loader = Loader;
exports.ScriptLoader = ScriptLoader;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=planck-loader.js.map
