webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var store_aware_1 = __webpack_require__(1);
var Manager = /** @class */function (_super) {
    __extends(Manager, _super);
    function Manager(store, props) {
        var _this = _super.call(this, store, props) || this;
        _this.entities = new Map();
        return _this;
    }
    Manager.prototype.componentWillReceiveProps = function (props, nextProps) {
        var _this = this;
        var oldR = this.getRepository(props);
        var newR = this.getRepository(nextProps);
        if (oldR !== newR) {
            // create entities that should exist
            var toCreate = newR.sort.filter(function (b) {
                return oldR.sort.indexOf(b) < 0;
            });
            toCreate.forEach(function (b) {
                return _this.createEntity(newR.items[b]);
            });
            // destroy entities that shouldn't exist 
            var toDestroy_1 = oldR.sort.filter(function (b) {
                return newR.sort.indexOf(b) < 0;
            });
            toDestroy_1.forEach(function (b) {
                return _this.destroyEntity(b);
            });
            // update entities if needed
            var toUpdate = newR.sort.filter(function (b) {
                return toDestroy_1.indexOf(b) < 0 && newR.items[b] !== oldR.items[b];
            });
            toUpdate.forEach(function (b) {
                return _this.updateEntity(newR.items[b]);
            });
        }
    };
    Manager.prototype.getEntityComponents = function (id) {
        return this.entities.get(id);
    };
    Manager.prototype.updateEntityComponents = function (id, w) {
        this.entities.set(id, w);
    };
    Manager.prototype.destroyEntity = function (id) {
        var components = this.entities.get(id) || [];
        components.forEach(function (c) {
            c.destroy();
        });
    };
    Manager.prototype.createEntity = function (entity) {
        // override
    };
    Manager.prototype.updateEntity = function (entity) {
        // override
    };
    return Manager;
}(store_aware_1.default);
exports.default = Manager;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __assign = this && this.__assign || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var StoreAware = /** @class */function () {
    function StoreAware(store, props) {
        var _this = this;
        this.localProps = Object.assign({}, props);
        this.store = store;
        store.subscribe(function () {
            var latestStoreState = store.getState();
            var keys = Object.keys(_this.localProps);
            var nextProps = keys.reduce(function (acc, k) {
                var _a;
                return __assign({}, acc, (_a = {}, _a[k] = latestStoreState[k], _a));
            }, {});
            var changed = keys.reduce(function (acc, k) {
                return acc || nextProps[k] !== _this.localProps[k];
            }, false);
            if (changed) {
                if (_this.componentShouldUpdate(_this.localProps, nextProps)) {
                    _this.componentWillReceiveProps(_this.localProps, nextProps);
                    _this.localProps = __assign({}, nextProps);
                    _this.render();
                }
            }
        });
    }
    StoreAware.prototype.componentShouldUpdate = function (props, nextProps) {
        // override
        return true;
    };
    StoreAware.prototype.componentWillReceiveProps = function (props, nextProps) {
        // override
    };
    StoreAware.prototype.render = function () {
        // override
    };
    return StoreAware;
}();
exports.default = StoreAware;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EntityBuilder = /** @class */ (function () {
    function EntityBuilder(type) {
        this.entity = document.createElement(type);
    }
    EntityBuilder.prototype.set = function (key, attribute) {
        this.entity.setAttribute(key, attribute);
        return this;
    };
    EntityBuilder.prototype.attachx = function (f) {
        f.el.appendChild(this.entity);
    };
    EntityBuilder.prototype.attach = function (parent) {
        if (!!parent) {
            // a parent was specified
            if ("el" in parent) {
                // there's an element in this parent; attach the entity
                // being created there
                parent.el.appendChild(this.entity);
            }
            else {
                // there isn't; attach directly
                parent.appendChild(this.entity);
            }
        }
        else {
            // attach to the scene by default
            document.querySelector("a-scene").appendChild(this.entity);
        }
        return this;
    };
    return EntityBuilder;
}());
exports.default = EntityBuilder;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var manager_1 = __webpack_require__(0);
exports.Manager = manager_1.default;
var store_aware_1 = __webpack_require__(1);
exports.StoreAware = store_aware_1.default;
var store_aware_component_1 = __webpack_require__(4);
exports.StoreAwareComponent = store_aware_component_1.default;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var aframe_typescript_toolkit_1 = __webpack_require__(5);
var manager_1 = __webpack_require__(0);
var Connector = /** @class */function (_super) {
    __extends(Connector, _super);
    function Connector(store, props, component) {
        var _this = _super.call(this, store, props) || this;
        _this.component = component;
        return _this;
    }
    Connector.prototype.getRepository = function (props) {
        return this.component.getRepository(props);
    };
    Connector.prototype.destroyEntity = function (id) {
        this.component.destroyEntity(id);
    };
    Connector.prototype.createEntity = function (entity) {
        this.component.createEntity(entity);
    };
    Connector.prototype.updateEntity = function (entity) {
        this.component.updateEntity(entity);
    };
    return Connector;
}(manager_1.default);
var StoreAwareComponent = /** @class */function (_super) {
    __extends(StoreAwareComponent, _super);
    function StoreAwareComponent(store, name, props, schema) {
        var _this = _super.call(this, name, schema) || this;
        _this.entities = new Map();
        _this.storeAware = new Connector(store, props, _this);
        _this.store = store;
        _this.register();
        return _this;
    }
    StoreAwareComponent.prototype.componentShouldUpdate = function (props, nextProps) {
        // override
        return true;
    };
    StoreAwareComponent.prototype.createEntity = function (entity) {
        // override
    };
    StoreAwareComponent.prototype.updateEntity = function (entity) {
        // override
    };
    StoreAwareComponent.prototype.destroyEntity = function (id) {
        var components = this.entities.get(id) || [];
        components.forEach(function (c) {
            c.destroy();
        });
    };
    StoreAwareComponent.prototype.getEntityComponents = function (id) {
        return this.entities.get(id);
    };
    StoreAwareComponent.prototype.updateEntityComponents = function (id, w) {
        this.entities.set(id, w);
    };
    return StoreAwareComponent;
}(aframe_typescript_toolkit_1.ComponentWrapper);
exports.default = StoreAwareComponent;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var component_wrapper_1 = __webpack_require__(6);
exports.ComponentWrapper = component_wrapper_1.default;
var entity_builder_1 = __webpack_require__(2);
exports.EntityBuilder = entity_builder_1.default;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var entity_builder_1 = __webpack_require__(2);
var ComponentWrapper = /** @class */ (function () {
    function ComponentWrapper(name, schema) {
        var _this = this;
        this.name = name;
        var funcs = ComponentWrapper.getInstanceMethodNames(this, Object.prototype);
        funcs.forEach(function (k) { return _this[k] = _this[k]; });
        this["schema"] = schema || {};
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // default aframe core function implementations
    ComponentWrapper.prototype.init = function () { };
    ComponentWrapper.prototype.pause = function () { };
    ComponentWrapper.prototype.play = function () { };
    ComponentWrapper.prototype.remove = function () { };
    ComponentWrapper.prototype.update = function (oldData) { };
    ComponentWrapper.prototype.extendSchema = function (update) { };
    ComponentWrapper.prototype.flushToDOM = function () { };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // special wrapper functions implementations
    ComponentWrapper.prototype.destroy = function () {
        var parent = this.el.parentElement;
        if (!!parent) {
            parent.removeChild(this.el);
        }
    };
    ComponentWrapper.prototype.register = function () {
        AFRAME.registerComponent(this.name, this);
    };
    ComponentWrapper.prototype.buildEntity = function (type) {
        return new entity_builder_1.default(type);
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // helpers
    ComponentWrapper.hasMethod = function (obj, name) {
        var desc = Object.getOwnPropertyDescriptor(obj, name);
        return !!desc && typeof desc.value === "function";
    };
    ComponentWrapper.getInstanceMethodNames = function (obj, stop) {
        var array = [];
        var proto = Object.getPrototypeOf(obj);
        while (proto && proto !== stop) {
            Object.getOwnPropertyNames(proto)
                .forEach(function (name) {
                if (name !== "constructor") {
                    if (ComponentWrapper.hasMethod(proto, name)) {
                        array.push(name);
                    }
                }
            });
            proto = Object.getPrototypeOf(proto);
        }
        return array;
    };
    return ComponentWrapper;
}());
exports.default = ComponentWrapper;


/***/ })
],[3]);