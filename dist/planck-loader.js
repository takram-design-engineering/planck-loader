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





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





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

'use strict';

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

//
//  The MIT License
//
//  Copyright (C) 2016-Present Shota Matsuda
//
//  Permission is hereby granted, free of charge, to any person obtaining a
//  copy of this software and associated documentation files (the "Software"),
//  to deal in the Software without restriction, including without limitation
//  the rights to use, copy, modify, merge, publish, distribute, sublicense,
//  and/or sell copies of the Software, and to permit persons to whom the
//  Software is furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//  THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//  DEALINGS IN THE SOFTWARE.
//

function Namespace() {
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

//
//  The MIT License
//
//  Copyright (C) 2016-Present Shota Matsuda
//
//  Permission is hereby granted, free of charge, to any person obtaining a
//  copy of this software and associated documentation files (the "Software"),
//  to deal in the Software without restriction, including without limitation
//  the rights to use, copy, modify, merge, publish, distribute, sublicense,
//  and/or sell copies of the Software, and to permit persons to whom the
//  Software is furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//  THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//  DEALINGS IN THE SOFTWARE.
//

var environmentType = function () {
  try {
    // eslint-disable-next-line no-new-func
    if (new Function('return this === window')()) {
      return 'browser';
    }
  } catch (error) {}
  try {
    // eslint-disable-next-line no-new-func
    if (new Function('return this === self')()) {
      return 'worker';
    }
  } catch (error) {}
  try {
    // eslint-disable-next-line no-new-func
    if (new Function('return this === global')()) {
      return 'node';
    }
  } catch (error) {}
  return undefined;
}();

var environmentSelf = void 0;
switch (environmentType) {
  case 'browser':
    environmentSelf = window;
    break;
  case 'worker':
    environmentSelf = self;
    break;
  case 'node':
    environmentSelf = global;
    break;
  default:
    break;
}

var Environment = {
  type: environmentType,
  self: environmentSelf
};

//
//  The MIT License
//
//  Copyright (C) 2016-Present Shota Matsuda
//
//  Permission is hereby granted, free of charge, to any person obtaining a
//  copy of this software and associated documentation files (the "Software"),
//  to deal in the Software without restriction, including without limitation
//  the rights to use, copy, modify, merge, publish, distribute, sublicense,
//  and/or sell copies of the Software, and to permit persons to whom the
//  Software is furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//  THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//  DEALINGS IN THE SOFTWARE.
//

var internal$2 = Namespace('Event');

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

      var scope = internal$2(this);
      scope.type = type !== undefined ? type : null;
      scope.captures = !!captures;
      scope.bubbles = !!bubbles;
      scope.cancelable = !!cancelable;
      scope.timeStamp = Environment.self.performance && Environment.self.performance.now && Environment.self.performance.now() || Date.now();
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
      var scope = internal$2(this);
      scope.propagationStopped = true;
    }
  }, {
    key: 'stopImmediatePropagation',
    value: function stopImmediatePropagation() {
      var scope = internal$2(this);
      scope.propagationStopped = true;
      scope.immediatePropagationStopped = true;
    }
  }, {
    key: 'preventDefault',
    value: function preventDefault() {
      if (this.cancelable) {
        var scope = internal$2(this);
        scope.defaultPrevented = true;
      }
    }
  }, {
    key: 'type',
    get: function get$$1() {
      var scope = internal$2(this);
      return scope.type;
    }
  }, {
    key: 'target',
    get: function get$$1() {
      var scope = internal$2(this);
      return scope.target;
    }
  }, {
    key: 'currentTarget',
    get: function get$$1() {
      var scope = internal$2(this);
      return scope.currentTarget;
    }
  }, {
    key: 'eventPhase',
    get: function get$$1() {
      var scope = internal$2(this);
      return scope.eventPhase;
    }
  }, {
    key: 'captures',
    get: function get$$1() {
      var scope = internal$2(this);
      return scope.captures;
    }
  }, {
    key: 'bubbles',
    get: function get$$1() {
      var scope = internal$2(this);
      return scope.bubbles;
    }
  }, {
    key: 'cancelable',
    get: function get$$1() {
      var scope = internal$2(this);
      return scope.cancelable;
    }
  }, {
    key: 'timeStamp',
    get: function get$$1() {
      var scope = internal$2(this);
      return scope.timeStamp;
    }
  }, {
    key: 'propagationStopped',
    get: function get$$1() {
      var scope = internal$2(this);
      return scope.propagationStopped;
    }
  }, {
    key: 'immediatePropagationStopped',
    get: function get$$1() {
      var scope = internal$2(this);
      return scope.immediatePropagationStopped;
    }
  }, {
    key: 'defaultPrevented',
    get: function get$$1() {
      var scope = internal$2(this);
      return scope.defaultPrevented;
    }
  }]);
  return Event;
}();

function modifyEvent(event) {
  var scope = internal$2(event);
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

//
//  The MIT License
//
//  Copyright (C) 2016-Present Shota Matsuda
//
//  Permission is hereby granted, free of charge, to any person obtaining a
//  copy of this software and associated documentation files (the "Software"),
//  to deal in the Software without restriction, including without limitation
//  the rights to use, copy, modify, merge, publish, distribute, sublicense,
//  and/or sell copies of the Software, and to permit persons to whom the
//  Software is furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//  THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//  DEALINGS IN THE SOFTWARE.
//

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

//
//  The MIT License
//
//  Copyright (C) 2016-Present Shota Matsuda
//
//  Permission is hereby granted, free of charge, to any person obtaining a
//  copy of this software and associated documentation files (the "Software"),
//  to deal in the Software without restriction, including without limitation
//  the rights to use, copy, modify, merge, publish, distribute, sublicense,
//  and/or sell copies of the Software, and to permit persons to whom the
//  Software is furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//  THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//  DEALINGS IN THE SOFTWARE.
//

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

      get(GenericEvent.prototype.__proto__ || Object.getPrototypeOf(GenericEvent.prototype), 'init', this).call(this, { type: type, target: target, captures: captures, bubbles: bubbles });
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

//
//  The MIT License
//
//  Copyright (C) 2016-Present Shota Matsuda
//
//  Permission is hereby granted, free of charge, to any person obtaining a
//  copy of this software and associated documentation files (the "Software"),
//  to deal in the Software without restriction, including without limitation
//  the rights to use, copy, modify, merge, publish, distribute, sublicense,
//  and/or sell copies of the Software, and to permit persons to whom the
//  Software is furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//  THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//  DEALINGS IN THE SOFTWARE.
//

var internal$1 = Namespace('EventDispatcherMixin');

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
        var eventPhase = event.eventPhase;
        if (!eventPhase || eventPhase === 'target' || eventPhase === 'capture') {
          for (var i = 0; i < listeners.capture.length; ++i) {
            handleEvent(event, listeners.capture[i]);
            if (event.immediatePropagationStopped) {
              return;
            }
          }
        }
        if (!eventPhase || eventPhase === 'target' || eventPhase === 'bubble') {
          for (var _i = 0; _i < listeners.bubble.length; ++_i) {
            handleEvent(event, listeners.bubble[_i]);
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

//
//  The MIT License
//
//  Copyright (C) 2016-Present Shota Matsuda
//
//  Permission is hereby granted, free of charge, to any person obtaining a
//  copy of this software and associated documentation files (the "Software"),
//  to deal in the Software without restriction, including without limitation
//  the rights to use, copy, modify, merge, publish, distribute, sublicense,
//  and/or sell copies of the Software, and to permit persons to whom the
//  Software is furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//  THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//  DEALINGS IN THE SOFTWARE.
//

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

//
//  The MIT License
//
//  Copyright (C) 2017-Present Shota Matsuda
//
//  Permission is hereby granted, free of charge, to any person obtaining a
//  copy of this software and associated documentation files (the "Software"),
//  to deal in the Software without restriction, including without limitation
//  the rights to use, copy, modify, merge, publish, distribute, sublicense,
//  and/or sell copies of the Software, and to permit persons to whom the
//  Software is furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//  THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//  DEALINGS IN THE SOFTWARE.
//

var internal = Namespace('DataLoader');

function setSize(target, value) {
  var scope = internal(target);
  if (value !== scope.size) {
    scope.size = value;
    target.dispatchEvent({ type: 'size' });
  }
}

function setProgress(target, value) {
  var scope = internal(target);
  if (value !== scope.progress) {
    scope.progress = value;
    target.dispatchEvent({ type: 'progress' });
  }
}

function setDeterminate(target, value) {
  var scope = internal(target);
  if (value !== scope.determinate) {
    scope.determinate = value;
    target.dispatchEvent({ type: 'determinate' });
  }
}

function setCompleted(target, value) {
  var scope = internal(target);
  if (value !== scope.completed) {
    scope.completed = value;
    target.dispatchEvent({ type: 'complete' });
  }
}

function setFailed(target, value) {
  var scope = internal(target);
  if (value !== scope.failed) {
    scope.failed = value;
    target.dispatchEvent({ type: 'error' });
  }
}

function handleInit(event) {
  var scope = internal(this);
  var request = event.target;
  request.removeEventListener('progress', scope.handlers.init, false);
  if (request.status !== 200) {
    return;
  }
  if (scope.size === 0) {
    setSize(this, event.total);
  }
  if (scope.size !== 0) {
    setDeterminate(this, true);
  }
}

function handleProgress(event) {
  var scope = internal(this);
  if (scope.determinate) {
    setProgress(this, Math.min(1, event.loaded / scope.size));
  }
}

function handleLoadend(event) {
  var scope = internal(this);
  var request = event.target;
  request.removeEventListener('progress', scope.handlers.progress, false);
  request.removeEventListener('loadend', scope.handlers.loadend, false);
  if (!scope.determinate) {
    setDeterminate(this, true);
  }
  if (request.status === 200) {
    setProgress(this, 1);
    scope.resolve(request);
    setCompleted(this, true);
  } else {
    // Rejecting before setting this as failed gives this status as the promise
    // rejection reason when aggregated.
    scope.reject(request.status);
    setFailed(this, true);
  }
}

var DataLoader = function (_EventDispatcher) {
  inherits(DataLoader, _EventDispatcher);

  function DataLoader(target) {
    classCallCheck(this, DataLoader);

    var _this = possibleConstructorReturn(this, (DataLoader.__proto__ || Object.getPrototypeOf(DataLoader)).call(this));

    var scope = internal(_this);
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
    return _this;
  }

  createClass(DataLoader, [{
    key: 'load',
    value: function load() {
      var _this2 = this;

      var scope = internal(this);
      if (scope.promise !== undefined) {
        return scope.promise;
      }
      if (this.url === null) {
        return Promise.reject(new Error('Attempt to load without is not set'));
      }
      scope.promise = new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        scope.handlers = {
          init: handleInit.bind(_this2),
          progress: handleProgress.bind(_this2),
          loadend: handleLoadend.bind(_this2)
        };
        request.addEventListener('progress', scope.handlers.init, false);
        request.addEventListener('progress', scope.handlers.progress, false);
        request.addEventListener('loadend', scope.handlers.loadend, false);
        request.open('get', _this2.url);
        request.send();
        scope.request = request;
        scope.resolve = resolve;
        scope.reject = reject;
      });
      return scope.promise;
    }
  }, {
    key: 'abort',
    value: function abort() {
      var scope = internal(this);
      if (scope.promise === undefined) {
        return;
      }
      scope.request.abort();
    }
  }, {
    key: 'request',
    get: function get$$1() {
      var scope = internal(this);
      return scope.request;
    }
  }, {
    key: 'url',
    get: function get$$1() {
      var scope = internal(this);
      return scope.url;
    }
  }, {
    key: 'size',
    get: function get$$1() {
      var scope = internal(this);
      return scope.size;
    }
  }, {
    key: 'progress',
    get: function get$$1() {
      var scope = internal(this);
      return scope.progress;
    }
  }, {
    key: 'determinate',
    get: function get$$1() {
      var scope = internal(this);
      return scope.determinate;
    }
  }, {
    key: 'completed',
    get: function get$$1() {
      var scope = internal(this);
      return scope.completed;
    }
  }, {
    key: 'failed',
    get: function get$$1() {
      var scope = internal(this);
      return scope.failed;
    }
  }]);
  return DataLoader;
}(EventDispatcher);

//
//  The MIT License
//
//  Copyright (C) 2017-Present Shota Matsuda
//
//  Permission is hereby granted, free of charge, to any person obtaining a
//  copy of this software and associated documentation files (the "Software"),
//  to deal in the Software without restriction, including without limitation
//  the rights to use, copy, modify, merge, publish, distribute, sublicense,
//  and/or sell copies of the Software, and to permit persons to whom the
//  Software is furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//  THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//  DEALINGS IN THE SOFTWARE.
//

var internal$4 = Namespace('ScriptLoader');

var ScriptLoader = function (_DataLoader) {
  inherits(ScriptLoader, _DataLoader);

  function ScriptLoader() {
    classCallCheck(this, ScriptLoader);
    return possibleConstructorReturn(this, (ScriptLoader.__proto__ || Object.getPrototypeOf(ScriptLoader)).apply(this, arguments));
  }

  createClass(ScriptLoader, [{
    key: 'load',
    value: function load() {
      var _this2 = this;

      var scope = internal$4(this);
      if (scope.promise !== undefined) {
        return scope.promise;
      }
      scope.promise = new Promise(function (resolve, reject) {
        get(ScriptLoader.prototype.__proto__ || Object.getPrototypeOf(ScriptLoader.prototype), 'load', _this2).call(_this2).then(function (request) {
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = _this2.url;
          script.onload = function () {
            _this2.dispatchEvent({ type: 'load' });
            resolve(request);
          };
          script.onerror = function () {
            _this2.dispatchEvent({ type: 'error' });
            reject(request.status);
          };
          var scripts = document.getElementsByTagName('script');
          var target = scripts[scripts.length - 1];
          target.parentNode.insertBefore(script, target);
        });
      });
      return scope.promise;
    }
  }]);
  return ScriptLoader;
}(DataLoader);

//
//  The MIT License
//
//  Copyright (C) 2017-Present Shota Matsuda
//
//  Permission is hereby granted, free of charge, to any person obtaining a
//  copy of this software and associated documentation files (the "Software"),
//  to deal in the Software without restriction, including without limitation
//  the rights to use, copy, modify, merge, publish, distribute, sublicense,
//  and/or sell copies of the Software, and to permit persons to whom the
//  Software is furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//  THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//  DEALINGS IN THE SOFTWARE.
//

var internal$3 = Namespace('Loader');

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

function updateDeterminate(target) {
  var scope = internal$3(target);
  var value = scope.loaders.every(function (loader) {
    return loader.determinate;
  });
  if (value !== scope.determinate) {
    scope.determinate = value;
    target.dispatchEvent({ type: 'determinate' });
  }
}

function updateCompleted(target) {
  var scope = internal$3(target);
  var value = scope.loaders.every(function (loader) {
    return loader.completed;
  });
  if (value !== scope.completed) {
    scope.completed = value;
    target.dispatchEvent({ type: 'complete' });
  }
}

function updateFailed(target) {
  var scope = internal$3(target);
  var value = scope.loaders.some(function (loader) {
    return loader.failed;
  });
  if (value !== scope.failed) {
    scope.failed = value;
    target.dispatchEvent({ type: 'error' });

    // Abort all the loaders
    if (scope.failed) {
      target.abort();
    }
  }
}

function handleSize(event) {
  this.dispatchEvent({ type: 'size' });
}

function handleProgress$1(event) {
  this.dispatchEvent({ type: 'progress' });
}

function handleDeterminate(event) {
  updateDeterminate(this);
}

function handleCompleted(event) {
  updateCompleted(this);
}

function handleFailed(event) {
  updateFailed(this);
}

var Loader = function (_EventDispatcher) {
  inherits(Loader, _EventDispatcher);

  function Loader() {
    classCallCheck(this, Loader);

    var _this = possibleConstructorReturn(this, (Loader.__proto__ || Object.getPrototypeOf(Loader)).call(this));

    var scope = internal$3(_this);
    scope.determinate = false;
    scope.completed = false;
    scope.failed = false;
    scope.handlers = {
      size: handleSize.bind(_this),
      progress: handleProgress$1.bind(_this),
      determinate: handleDeterminate.bind(_this),
      completed: handleCompleted.bind(_this),
      failed: handleFailed.bind(_this)
    };

    for (var _len = arguments.length, sequence = Array(_len), _key = 0; _key < _len; _key++) {
      sequence[_key] = arguments[_key];
    }

    scope.sequence = construct(sequence);
    scope.loaders = expand(scope.sequence);
    scope.loaders.forEach(function (loader) {
      loader.addEventListener('size', scope.handlers.size, false);
      loader.addEventListener('progress', scope.handlers.progress, false);
      loader.addEventListener('determinate', scope.handlers.determinate, false);
      loader.addEventListener('complete', scope.handlers.completed, false);
      loader.addEventListener('error', scope.handlers.failed, false);
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

//
//  The MIT License
//
//  Copyright (C) 2017-Present Shota Matsuda
//
//  Permission is hereby granted, free of charge, to any person obtaining a
//  copy of this software and associated documentation files (the "Software"),
//  to deal in the Software without restriction, including without limitation
//  the rights to use, copy, modify, merge, publish, distribute, sublicense,
//  and/or sell copies of the Software, and to permit persons to whom the
//  Software is furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//  THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//  DEALINGS IN THE SOFTWARE.
//

exports.DataLoader = DataLoader;
exports.Loader = Loader;
exports.ScriptLoader = ScriptLoader;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=planck-loader.js.map
