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











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
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

function Namespace() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

  var symbol = Symbol(name);
  return function namespace(object) {
    var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (data) {
      return data;
    };

    if (object[symbol] === undefined) {
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

var internal$1 = Namespace('Event');

var Event = function () {
  function Event() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, Event);

    this.init(options);
  }

  createClass(Event, [{
    key: 'init',
    value: function init() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          type = _ref2.type,
          _ref2$captures = _ref2.captures,
          captures = _ref2$captures === undefined ? true : _ref2$captures,
          _ref2$bubbles = _ref2.bubbles,
          bubbles = _ref2$bubbles === undefined ? false : _ref2$bubbles;

      var scope = internal$1(this);
      scope.type = type || null;
      scope.captures = !!captures;
      scope.bubbles = !!bubbles;
      scope.timestamp = Date.now();
      scope.propagationStopped = false;
      scope.immediatePropagationStopped = false;
      scope.target = null;
      scope.currentTarget = null;
      scope.phase = null;
      return this;
    }
  }, {
    key: 'stopPropagation',
    value: function stopPropagation() {
      var scope = internal$1(this);
      scope.propagationStopped = true;
    }
  }, {
    key: 'stopImmediatePropagation',
    value: function stopImmediatePropagation() {
      var scope = internal$1(this);
      scope.propagationStopped = true;
      scope.immediatePropagationStopped = true;
    }
  }, {
    key: 'type',
    get: function get$$1() {
      var scope = internal$1(this);
      return scope.type;
    }
  }, {
    key: 'target',
    get: function get$$1() {
      var scope = internal$1(this);
      return scope.target;
    }
  }, {
    key: 'currentTarget',
    get: function get$$1() {
      var scope = internal$1(this);
      return scope.currentTarget;
    }
  }, {
    key: 'phase',
    get: function get$$1() {
      var scope = internal$1(this);
      return scope.phase;
    }
  }, {
    key: 'captures',
    get: function get$$1() {
      var scope = internal$1(this);
      return scope.captures;
    }
  }, {
    key: 'bubbles',
    get: function get$$1() {
      var scope = internal$1(this);
      return scope.bubbles;
    }
  }, {
    key: 'timestamp',
    get: function get$$1() {
      var scope = internal$1(this);
      return scope.timestamp;
    }
  }, {
    key: 'propagationStopped',
    get: function get$$1() {
      var scope = internal$1(this);
      return scope.propagationStopped;
    }
  }, {
    key: 'immediatePropagationStopped',
    get: function get$$1() {
      var scope = internal$1(this);
      return scope.immediatePropagationStopped;
    }
  }]);
  return Event;
}();

function modifyEvent(event) {
  var scope = internal$1(event);
  return {
    set target(value) {
      scope.target = value || null;
    },

    set currentTarget(value) {
      scope.currentTarget = value || null;
    },

    set phase(value) {
      scope.phase = value || null;
    }
  };
}

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

var objectWithoutProperties$$1 = function objectWithoutProperties$$1(obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
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
          rest = objectWithoutProperties$$1(_ref, ['type', 'target']);


      get(CustomEvent.prototype.__proto__ || Object.getPrototypeOf(CustomEvent.prototype), 'init', this).call(this, _extends({}, rest, { type: type }));
      modifyEvent(this).target = target;
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

var internal$1$1 = Namespace('EventBundle');

var EventBundle = function (_Event2) {
  inherits(EventBundle, _Event2);

  function EventBundle() {
    classCallCheck(this, EventBundle);
    return possibleConstructorReturn(this, (EventBundle.__proto__ || Object.getPrototypeOf(EventBundle)).apply(this, arguments));
  }

  createClass(EventBundle, [{
    key: 'init',
    value: function init() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var originalEvent = _ref.originalEvent,
          rest = objectWithoutProperties$$1(_ref, ['originalEvent']);


      get(EventBundle.prototype.__proto__ || Object.getPrototypeOf(EventBundle.prototype), 'init', this).call(this, _extends({}, rest));
      var scope = internal$1$1(this);
      scope.originalEvent = originalEvent;
      return this;
    }
  }, {
    key: 'preventDefault',
    value: function preventDefault() {
      var scope = internal$1$1(this);
      scope.originalEvent.preventDefault();
    }
  }, {
    key: 'defaultPrevented',
    get: function get$$1() {
      var scope = internal$1$1(this);
      return scope.originalEvent.defaultPrevented;
    }
  }, {
    key: 'originalEvent',
    get: function get$$1() {
      var scope = internal$1$1(this);
      return scope.originalEvent;
    }
  }]);
  return EventBundle;
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
      var _this4 = this;

      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var type = _ref.type,
          target = _ref.target,
          rest = objectWithoutProperties$$1(_ref, ['type', 'target']);


      get(GenericEvent.prototype.__proto__ || Object.getPrototypeOf(GenericEvent.prototype), 'init', this).call(this, { type: type, target: target, captures: false, bubbles: false });
      Object.entries(rest).forEach(function (entry) {
        var _entry = slicedToArray(entry, 2),
            property = _entry[0],
            value = _entry[1];

        if (!{}.hasOwnProperty.call(_this4, property)) {
          _this4[property] = value;
        } else {
          throw new Error('Name "' + property + '" cannot be used for event property');
        }
      });
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

var internal$2 = Namespace('EventDispatcher');

var EventDispatcher = function () {
  function EventDispatcher() {
    classCallCheck(this, EventDispatcher);

    var scope = internal$2(this);
    scope.listeners = {};
  }

  createClass(EventDispatcher, [{
    key: 'addEventListener',
    value: function addEventListener(type, listener) {
      var capture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (typeof listener !== 'function' && (typeof listener === 'undefined' ? 'undefined' : _typeof(listener)) !== 'object') {
        throw new Error('Attempt to add non-function non-object listener');
      }
      var scope = internal$2(this);
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

      var scope = internal$2(this);
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
    key: 'dispatchEvent',
    value: function dispatchEvent(object) {
      var _this5 = this;

      var event = object;
      if (!(event instanceof Event)) {
        event = new GenericEvent(object);
      }
      var scope = internal$2(this);
      var listeners = scope.listeners[event.type];
      if (listeners === undefined) {
        return;
      }
      var phase = event.phase;
      if (!phase || phase === 'target' || phase === 'capture') {
        [].concat(toConsumableArray(listeners.capture)).some(function (listener) {
          if (typeof listener === 'function') {
            listener.call(_this5, event);
          } else if (typeof listener.handleEvent === 'function') {
            listener.handleEvent(event);
          } else {
            throw new Error('Listener is neither function nor event listener');
          }
          return event.immediatePropagationStopped;
        });
      }
      if (event.immediatePropagationStopped) {
        return;
      }
      if (!phase || phase === 'target' || phase === 'bubble') {
        [].concat(toConsumableArray(listeners.bubble)).some(function (listener) {
          if (typeof listener === 'function') {
            listener.call(_this5, event);
          } else if (typeof listener.handleEvent === 'function') {
            listener.handleEvent(event);
          }
          return event.immediatePropagationStopped;
        });
      }
    }
  }]);
  return EventDispatcher;
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

var internal$3 = Namespace('EventTarget');

var EventTarget = function (_EventDispatcher) {
  inherits(EventTarget, _EventDispatcher);

  function EventTarget() {
    classCallCheck(this, EventTarget);

    var _this6 = possibleConstructorReturn(this, (EventTarget.__proto__ || Object.getPrototypeOf(EventTarget)).call(this));

    var scope = internal$3(_this6);
    scope.ancestorEventTarget = null;
    scope.descendantEventTarget = null;
    return _this6;
  }

  createClass(EventTarget, [{
    key: 'determinePropagationPath',
    value: function determinePropagationPath() {
      var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var path = [];
      if (target !== null && target !== undefined) {
        var ancestor = target;
        while (ancestor !== null && ancestor !== undefined) {
          path.unshift(ancestor);
          ancestor = ancestor.ancestorEventTarget;
        }
      } else {
        var descendant = this;
        while (descendant !== null && descendant !== undefined) {
          path.push(descendant);
          descendant = descendant.descendantEventTarget;
        }
      }
      return path;
    }
  }, {
    key: 'dispatchImmediateEvent',
    value: function dispatchImmediateEvent(event) {
      get(EventTarget.prototype.__proto__ || Object.getPrototypeOf(EventTarget.prototype), 'dispatchEvent', this).call(this, event);
    }
  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(object) {
      var propagationPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var event = object;
      if (!(event instanceof Event)) {
        event = new GenericEvent(object);
      }

      // Just dispatch the event if it doesn't capture nor bubble
      if (!event.captures && !event.bubbles) {
        this.dispatchImmediateEvent(event);
        return;
      }

      // Determine the capturing path of this event
      var capturingPath = void 0;
      if (propagationPath !== null && propagationPath !== undefined) {
        capturingPath = [].concat(toConsumableArray(propagationPath));
      } else if (event.target) {
        capturingPath = this.determinePropagationPath(event.target);
      }

      // The last item in the propagation path must always be the event target
      var modifier = modifyEvent(event);
      if (event.target === null) {
        modifier.target = capturingPath.pop();
      } else {
        capturingPath.pop();
      }
      var bubblingPath = [].concat(toConsumableArray(capturingPath));
      bubblingPath.reverse();

      // Capturing phase
      if (event.captures) {
        modifier.phase = 'capture';
        capturingPath.some(function (object) {
          modifier.currentTarget = object;
          event.currentTarget.dispatchImmediateEvent(event);
          return event.propagationStopped;
        });
      }
      if (event.propagationStopped) {
        return;
      }

      // Target phase. The target can be an integer if the parent target has
      // multiple identifiers, typically when picking an instanced geometry.
      if (!Number.isInteger(event.target)) {
        modifier.phase = 'target';
        modifier.currentTarget = event.target;
        event.currentTarget.dispatchImmediateEvent(event);
        if (event.propagationStopped) {
          return;
        }
      }

      // Bubbling phase
      if (event.bubbles) {
        modifier.phase = 'bubble';
        bubblingPath.some(function (object) {
          modifier.currentTarget = object;
          event.currentTarget.dispatchImmediateEvent(event);
          return event.propagationStopped;
        });
      }
    }
  }, {
    key: 'ancestorEventTarget',
    get: function get$$1() {
      var scope = internal$3(this);
      return scope.ancestorEventTarget;
    },
    set: function set$$1(value) {
      var scope = internal$3(this);
      scope.ancestorEventTarget = value || null;
    }
  }, {
    key: 'descendantEventTarget',
    get: function get$$1() {
      var scope = internal$3(this);
      return scope.descendantEventTarget;
    },
    set: function set$$1(value) {
      var scope = internal$3(this);
      scope.descendantEventTarget = value || null;
    }
  }]);
  return EventTarget;
}(EventDispatcher);

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

var KeyboardEvent = function (_EventBundle) {
  inherits(KeyboardEvent, _EventBundle);

  function KeyboardEvent() {
    classCallCheck(this, KeyboardEvent);
    return possibleConstructorReturn(this, (KeyboardEvent.__proto__ || Object.getPrototypeOf(KeyboardEvent)).apply(this, arguments));
  }

  createClass(KeyboardEvent, [{
    key: 'init',
    value: function init() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var rest = objectWithoutProperties$$1(_ref, []);

      get(KeyboardEvent.prototype.__proto__ || Object.getPrototypeOf(KeyboardEvent.prototype), 'init', this).call(this, _extends({}, rest));
      return this;
    }
  }, {
    key: 'key',
    get: function get$$1() {
      return this.originalEvent.key;
    }
  }, {
    key: 'code',
    get: function get$$1() {
      return this.originalEvent.code;
    }
  }, {
    key: 'ctrlKey',
    get: function get$$1() {
      return this.originalEvent.ctrlKey;
    }
  }, {
    key: 'shiftKey',
    get: function get$$1() {
      return this.originalEvent.shiftKey;
    }
  }, {
    key: 'altKey',
    get: function get$$1() {
      return this.originalEvent.altKey;
    }
  }, {
    key: 'metaKey',
    get: function get$$1() {
      return this.originalEvent.metaKey;
    }
  }, {
    key: 'repeat',
    get: function get$$1() {
      return this.originalEvent.repeat;
    }
  }]);
  return KeyboardEvent;
}(EventBundle);

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

var internal$4 = Namespace('MouseEvent');

var MouseEvent = function (_EventBundle2) {
  inherits(MouseEvent, _EventBundle2);

  function MouseEvent() {
    classCallCheck(this, MouseEvent);
    return possibleConstructorReturn(this, (MouseEvent.__proto__ || Object.getPrototypeOf(MouseEvent)).apply(this, arguments));
  }

  createClass(MouseEvent, [{
    key: 'init',
    value: function init() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var x = _ref.x,
          y = _ref.y,
          movementX = _ref.movementX,
          movementY = _ref.movementY,
          rest = objectWithoutProperties$$1(_ref, ['x', 'y', 'movementX', 'movementY']);


      get(MouseEvent.prototype.__proto__ || Object.getPrototypeOf(MouseEvent.prototype), 'init', this).call(this, _extends({}, rest));
      var scope = internal$4(this);
      scope.x = x;
      scope.y = y;
      scope.movementX = movementX;
      scope.movementY = movementY;
      return this;
    }
  }, {
    key: 'x',
    get: function get$$1() {
      var scope = internal$4(this);
      return scope.x;
    }
  }, {
    key: 'y',
    get: function get$$1() {
      var scope = internal$4(this);
      return scope.y;
    }
  }, {
    key: 'movementX',
    get: function get$$1() {
      var scope = internal$4(this);
      return scope.movementX;
    }
  }, {
    key: 'movementY',
    get: function get$$1() {
      var scope = internal$4(this);
      return scope.movementY;
    }
  }, {
    key: 'button',
    get: function get$$1() {
      return this.originalEvent.button;
    }
  }, {
    key: 'ctrlKey',
    get: function get$$1() {
      return this.originalEvent.ctrlKey;
    }
  }, {
    key: 'shiftKey',
    get: function get$$1() {
      return this.originalEvent.shiftKey;
    }
  }, {
    key: 'altKey',
    get: function get$$1() {
      return this.originalEvent.altKey;
    }
  }, {
    key: 'metaKey',
    get: function get$$1() {
      return this.originalEvent.metaKey;
    }
  }]);
  return MouseEvent;
}(EventBundle);

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

var internal$5 = Namespace('Touch');

var Touch = function () {
  function Touch() {
    classCallCheck(this, Touch);

    this.init.apply(this, arguments);
  }

  createClass(Touch, [{
    key: 'init',
    value: function init() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          x = _ref3.x,
          y = _ref3.y,
          target = _ref3.target,
          originalTouch = _ref3.originalTouch;

      var scope = internal$5(this);
      scope.x = x;
      scope.y = y;
      scope.target = target;
      scope.originalTouch = originalTouch;
      return this;
    }
  }, {
    key: 'identifier',
    get: function get$$1() {
      return this.originalTouch.identifier;
    }
  }, {
    key: 'x',
    get: function get$$1() {
      var scope = internal$5(this);
      return scope.x;
    }
  }, {
    key: 'y',
    get: function get$$1() {
      var scope = internal$5(this);
      return scope.y;
    }
  }, {
    key: 'target',
    get: function get$$1() {
      var scope = internal$5(this);
      return scope.target;
    }
  }, {
    key: 'originalTouch',
    get: function get$$1() {
      var scope = internal$5(this);
      return scope.originalTouch;
    }
  }]);
  return Touch;
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

var internal$6 = Namespace('TouchEvent');

var TouchEvent = function (_EventBundle3) {
  inherits(TouchEvent, _EventBundle3);

  function TouchEvent() {
    classCallCheck(this, TouchEvent);
    return possibleConstructorReturn(this, (TouchEvent.__proto__ || Object.getPrototypeOf(TouchEvent)).apply(this, arguments));
  }

  createClass(TouchEvent, [{
    key: 'init',
    value: function init() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var touches = _ref.touches,
          changedTouches = _ref.changedTouches,
          rest = objectWithoutProperties$$1(_ref, ['touches', 'changedTouches']);


      get(TouchEvent.prototype.__proto__ || Object.getPrototypeOf(TouchEvent.prototype), 'init', this).call(this, _extends({}, rest));
      var scope = internal$6(this);
      scope.touches = touches;
      scope.changedTouches = changedTouches;
      return this;
    }
  }, {
    key: 'touches',
    get: function get$$1() {
      var scope = internal$6(this);
      return scope.touches;
    }
  }, {
    key: 'changedTouches',
    get: function get$$1() {
      var scope = internal$6(this);
      return scope.changedTouches;
    }
  }, {
    key: 'ctrlKey',
    get: function get$$1() {
      return this.originalEvent.ctrlKey;
    }
  }, {
    key: 'shiftKey',
    get: function get$$1() {
      return this.originalEvent.shiftKey;
    }
  }, {
    key: 'altKey',
    get: function get$$1() {
      return this.originalEvent.altKey;
    }
  }, {
    key: 'metaKey',
    get: function get$$1() {
      return this.originalEvent.metaKey;
    }
  }]);
  return TouchEvent;
}(EventBundle);

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

var TouchList = function (_Array) {
  inherits(TouchList, _Array);

  function TouchList() {
    classCallCheck(this, TouchList);

    var _this10 = possibleConstructorReturn(this, (TouchList.__proto__ || Object.getPrototypeOf(TouchList)).call(this));

    _this10.init.apply(_this10, arguments);
    return _this10;
  }

  createClass(TouchList, [{
    key: 'init',
    value: function init(first) {
      this.length = 0;
      if (first instanceof TouchList) {
        this.push.apply(this, toConsumableArray(first));
      } else {
        for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          rest[_key - 1] = arguments[_key];
        }

        this.push.apply(this, [first].concat(rest));
      }
    }
  }, {
    key: 'item',
    value: function item(index) {
      return this[index];
    }
  }]);
  return TouchList;
}(Array);

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

var WheelEvent = function (_MouseEvent) {
  inherits(WheelEvent, _MouseEvent);

  function WheelEvent() {
    classCallCheck(this, WheelEvent);
    return possibleConstructorReturn(this, (WheelEvent.__proto__ || Object.getPrototypeOf(WheelEvent)).apply(this, arguments));
  }

  createClass(WheelEvent, [{
    key: 'init',
    value: function init() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var rest = objectWithoutProperties$$1(_ref, []);

      get(WheelEvent.prototype.__proto__ || Object.getPrototypeOf(WheelEvent.prototype), 'init', this).call(this, _extends({}, rest, { type: 'wheel' }));
      return this;
    }
  }, {
    key: 'deltaX',
    get: function get$$1() {
      return this.originalEvent.deltaX;
    }
  }, {
    key: 'deltaY',
    get: function get$$1() {
      return this.originalEvent.deltaY;
    }
  }, {
    key: 'deltaZ',
    get: function get$$1() {
      return this.originalEvent.deltaZ;
    }
  }]);
  return WheelEvent;
}(MouseEvent);

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

function Namespace$1() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

  var symbol = Symbol(name);
  return function namespace(object) {
    var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (data) {
      return data;
    };

    if (object[symbol] === undefined) {
      object[symbol] = init({});
    }
    return object[symbol];
  };
}

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

var internal = Namespace$1('DataLoader');

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
        return Promise.reject();
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

function setSize(target, value) {
  var scope = internal(target);
  if (value !== scope.size) {
    scope.size = value;
    target.dispatchEvent({ type: 'size', target: target });
  }
}

function setProgress(target, value) {
  var scope = internal(target);
  if (value !== scope.progress) {
    scope.progress = value;
    target.dispatchEvent({ type: 'progress', target: target });
  }
}

function setDeterminate(target, value) {
  var scope = internal(target);
  if (value !== scope.determinate) {
    scope.determinate = value;
    target.dispatchEvent({ type: 'determinate', target: target });
  }
}

function setCompleted(target, value) {
  var scope = internal(target);
  if (value !== scope.completed) {
    scope.completed = value;
    target.dispatchEvent({ type: 'completed', target: target });
  }
}

function setFailed(target, value) {
  var scope = internal(target);
  if (value !== scope.failed) {
    scope.failed = value;
    target.dispatchEvent({ type: 'failed', target: target });
  }
}

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

var internal$3$1 = Namespace$1('ScriptLoader');

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

      var scope = internal$3$1(this);
      if (scope.promise !== undefined) {
        return scope.promise;
      }
      scope.promise = new Promise(function (resolve, reject) {
        get(ScriptLoader.prototype.__proto__ || Object.getPrototypeOf(ScriptLoader.prototype), 'load', _this2).call(_this2).then(function (request) {
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = _this2.url;
          script.onload = function () {
            resolve(request);
          };
          script.onerror = function () {
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

var internal$2$1 = Namespace$1('Loader');

var Loader = function (_EventDispatcher) {
  inherits(Loader, _EventDispatcher);

  function Loader() {
    classCallCheck(this, Loader);

    var _this = possibleConstructorReturn(this, (Loader.__proto__ || Object.getPrototypeOf(Loader)).call(this));

    var scope = internal$2$1(_this);
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
      loader.addEventListener('completed', scope.handlers.completed, false);
      loader.addEventListener('failed', scope.handlers.failed, false);
    });
    return _this;
  }

  createClass(Loader, [{
    key: 'load',
    value: function load() {
      var scope = internal$2$1(this);
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
      var scope = internal$2$1(this);
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
      var scope = internal$2$1(this);
      return [].concat(toConsumableArray(scope.loaders));
    }
  }, {
    key: 'size',
    get: function get$$1() {
      var scope = internal$2$1(this);
      return scope.loaders.reduce(function (size, loader) {
        return size + loader.size;
      }, 0);
    }
  }, {
    key: 'progress',
    get: function get$$1() {
      var scope = internal$2$1(this);

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
      var scope = internal$2$1(this);
      return scope.determinate;
    }
  }, {
    key: 'completed',
    get: function get$$1() {
      var scope = internal$2$1(this);
      return scope.completed;
    }
  }, {
    key: 'failed',
    get: function get$$1() {
      var scope = internal$2$1(this);
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

function handleSize(event) {
  this.dispatchEvent({ type: 'size', target: this });
}

function handleProgress$1(event) {
  this.dispatchEvent({ type: 'progress', target: this });
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

function updateDeterminate(target) {
  var scope = internal$2$1(target);
  var value = scope.loaders.every(function (loader) {
    return loader.determinate;
  });
  if (value !== scope.determinate) {
    scope.determinate = value;
    target.dispatchEvent({ type: 'determinate', target: target });
  }
}

function updateCompleted(target) {
  var scope = internal$2$1(target);
  var value = scope.loaders.every(function (loader) {
    return loader.completed;
  });
  if (value !== scope.completed) {
    scope.completed = value;
    target.dispatchEvent({ type: 'completed', target: target });
  }
}

function updateFailed(target) {
  var scope = internal$2$1(target);
  var value = scope.loaders.some(function (loader) {
    return loader.failed;
  });
  if (value !== scope.failed) {
    scope.failed = value;
    target.dispatchEvent({ type: 'failed', target: target });

    // Abort all the loaders
    if (scope.failed) {
      target.abort();
    }
  }
}

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
