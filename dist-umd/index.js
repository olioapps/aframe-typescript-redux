(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["AframeRedux"] = factory();
	else
		root["AframeRedux"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return webpackJsonpAframeRedux([0],[
/* 0 */
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
                }
            }
        });
    }
    StoreAware.prototype.componentShouldUpdate = function (props, nextProps) {
        // override
        return props !== nextProps;
    };
    StoreAware.prototype.componentWillReceiveProps = function (props, nextProps) {
        // override
    };
    return StoreAware;
}();
exports.default = StoreAware;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var store_aware_1 = __webpack_require__(0);
exports.StoreAware = store_aware_1.default;
var aframe_wrapper_store_aware_1 = __webpack_require__(2);
exports.StoreAwareComponent = aframe_wrapper_store_aware_1.StoreAwareComponent;
exports.StoreAwareSystem = aframe_wrapper_store_aware_1.StoreAwareSystem;
exports.StoreAwareRepositoryComponent = aframe_wrapper_store_aware_1.StoreAwareRepositoryComponent;
exports.dispatch = aframe_wrapper_store_aware_1.dispatch;
exports.ReduxConnectedSystem = aframe_wrapper_store_aware_1.ReduxConnectedSystem;

/***/ }),
/* 2 */
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
var aframe_typescript_toolkit_1 = __webpack_require__(3);
var store_aware_1 = __webpack_require__(0);
var Connector = /** @class */function (_super) {
    __extends(Connector, _super);
    function Connector(store, props, receiver) {
        var _this = _super.call(this, store, props) || this;
        _this.receiver = receiver;
        return _this;
    }
    Connector.prototype.componentWillReceiveProps = function (props, nextProps) {
        this.receiver.componentWillReceiveProps(props, nextProps);
    };
    return Connector;
}(store_aware_1.default);
var SharedStateContainer = /** @class */function () {
    function SharedStateContainer() {
        this.sharedState = new Map();
    }
    SharedStateContainer.prototype.get = function () {
        var state = this.sharedState.get("_");
        if (!state) {
            this.set(null);
        } else {
            return state;
        }
    };
    SharedStateContainer.prototype.set = function (sharedState) {
        this.sharedState.set("_", sharedState);
    };
    return SharedStateContainer;
}();
var StoreAwareComponent = /** @class */function (_super) {
    __extends(StoreAwareComponent, _super);
    function StoreAwareComponent(store, name, props, schema) {
        var _this = _super.call(this, name, schema || {}) || this;
        _this.sharedState = new SharedStateContainer();
        _this.storeAware = new Connector(store, props, _this);
        _this.store = store;
        return _this;
    }
    StoreAwareComponent.prototype.getSharedState = function () {
        return this.sharedState.get();
    };
    StoreAwareComponent.prototype.setSharedState = function (sharedState) {
        return this.sharedState.set(sharedState);
    };
    return StoreAwareComponent;
}(aframe_typescript_toolkit_1.ComponentWrapper);
exports.StoreAwareComponent = StoreAwareComponent;
/**
 * Watches the whole store
 */
var StoreAwareSystem = /** @class */function (_super) {
    __extends(StoreAwareSystem, _super);
    function StoreAwareSystem(store, name, props, schema) {
        var _this = _super.call(this, name, schema || {}) || this;
        _this.sharedState = new SharedStateContainer();
        _this.store = store;
        _this.storeAware = new Connector(store, props, _this);
        _this.store = store;
        return _this;
    }
    StoreAwareSystem.prototype.getSharedState = function () {
        return this.sharedState.get();
    };
    StoreAwareSystem.prototype.setSharedState = function (sharedState) {
        return this.sharedState.set(sharedState);
    };
    return StoreAwareSystem;
}(aframe_typescript_toolkit_1.SystemWrapper);
exports.StoreAwareSystem = StoreAwareSystem;
/**
 * Maintains a 1:1 relationship between a store object we want to watch, and
 * an aframe entity component instance
 */
var StoreAwareRepositoryComponent = /** @class */function (_super) {
    __extends(StoreAwareRepositoryComponent, _super);
    function StoreAwareRepositoryComponent(store, name, props, schema) {
        var _this = _super.call(this, store, name, props, schema) || this;
        _this.setSharedState(new Map());
        return _this;
    }
    StoreAwareRepositoryComponent.prototype.componentWillReceiveProps = function (props, nextProps) {
        var _this = this;
        // create entities that should exist
        var toCreate = this.determineEntitiesToCreate(props, nextProps);
        toCreate.forEach(function (STORE_OBJECT) {
            return _this.createEntity(STORE_OBJECT);
        });
        // destroy entities that shouldn't exist 
        var toDestroy = this.determineEntitiesToDestroy(props, nextProps);
        toDestroy.forEach(function (STORE_OBJECT) {
            return _this.destroyEntity(STORE_OBJECT);
        });
        // update entities if needed
        var toUpdate = this.determineEntitiesToUpdate(props, nextProps);
        toUpdate.forEach(function (STORE_OBJECT) {
            return _this.updateEntity(STORE_OBJECT);
        });
    };
    StoreAwareRepositoryComponent.prototype.determineEntitiesToCreate = function (props, nextProps) {
        var oldR = this.resolveRepository(props);
        var newR = this.resolveRepository(nextProps);
        return newR.sort.filter(function (b) {
            return oldR.sort.indexOf(b) < 0;
        }).map(function (i) {
            return newR.items[i];
        });
    };
    StoreAwareRepositoryComponent.prototype.determineEntitiesToDestroy = function (props, nextProps) {
        var oldR = this.resolveRepository(props);
        var newR = this.resolveRepository(nextProps);
        return oldR.sort.filter(function (b) {
            return newR.sort.indexOf(b) < 0;
        }).map(function (i) {
            return oldR.items[i];
        });
    };
    StoreAwareRepositoryComponent.prototype.determineEntitiesToUpdate = function (props, nextProps) {
        var oldR = this.resolveRepository(props);
        var newR = this.resolveRepository(nextProps);
        var toDestroyIds = this.determineEntitiesToDestroy(props, nextProps).map(function (STORE_OBJECT) {
            return STORE_OBJECT.id;
        });
        var toUpdate = newR.sort.filter(function (b) {
            return toDestroyIds.indexOf(b) < 0 && oldR.sort.indexOf(b) > -1 && newR.sort.indexOf(b) > -1 && newR.items[b] !== oldR.items[b];
        });
        return toUpdate.map(function (i) {
            return newR.items[i];
        });
    };
    StoreAwareRepositoryComponent.prototype.onStoreObjectUpdate = function (entity, component) {
        // override noop
    };
    // called right before the aframe component is destroyed
    StoreAwareRepositoryComponent.prototype.beforeStoreObjectDestroy = function (entity, w) {
        // override noop
    };
    StoreAwareRepositoryComponent.prototype.updateEntity = function (entity) {
        var c = this.getEntityComponentsFor(entity.id);
        this.onStoreObjectUpdate(entity, c);
    };
    StoreAwareRepositoryComponent.prototype.createEntity = function (entity, parent) {
        var aframeComponent = this.onStoreObjectCreate(entity);
        if (aframeComponent && parent) {
            // attach to optional parent
            parent.appendChild(aframeComponent);
        } else {
            // otherwise attach to scene
            document.querySelector("a-scene").appendChild(aframeComponent);
        }
    };
    StoreAwareRepositoryComponent.prototype.destroyEntity = function (entity) {
        var aframeComponent = this.getEntityComponentsFor(entity.id);
        if (aframeComponent) {
            this.beforeStoreObjectDestroy(entity, aframeComponent);
            aframeComponent.destroy();
        }
    };
    StoreAwareRepositoryComponent.prototype.getEntityComponentsFor = function (id) {
        return this.getSharedState().get(id);
    };
    StoreAwareRepositoryComponent.prototype.updateEntityComponents = function (id, w) {
        this.getSharedState().set(id, w);
    };
    //
    // -- aframe component lifecycle functions
    //
    /**
     * by default, register aframe component instance
     */
    StoreAwareRepositoryComponent.prototype.init = function () {
        _super.prototype.init.call(this);
        var storeObject = this.resolveStoreObject(this.data);
        this.updateEntityComponents(storeObject.id, this);
    };
    return StoreAwareRepositoryComponent;
}(StoreAwareComponent);
exports.StoreAwareRepositoryComponent = StoreAwareRepositoryComponent;
var ReduxConnectedComponent = /** @class */function (_super) {
    __extends(ReduxConnectedComponent, _super);
    function ReduxConnectedComponent() {
        return _super.call(this, "redux-connected") || this;
    }
    ReduxConnectedComponent.prototype.init = function () {
        this.system.connect(this);
    };
    return ReduxConnectedComponent;
}(aframe_typescript_toolkit_1.ComponentWrapper);
exports.ReduxConnectedComponent = ReduxConnectedComponent;
var ReduxConnectedSystem = /** @class */function (_super) {
    __extends(ReduxConnectedSystem, _super);
    function ReduxConnectedSystem(store, props) {
        var _this = _super.call(this, store, "redux-connected", props) || this;
        _this.setSharedState({
            propsToComponentMapping: {}
        });
        new ReduxConnectedComponent().register();
        return _this;
    }
    ReduxConnectedSystem.prototype.connect = function (component) {
        // add store dispatch
        component.el["dispatch"] = this.store.dispatch;
        // handle cleaning up - remove references to destroyed entities
        var that = this;
        component.el.addEventListener("componentremoved", function (evt) {
            var state = that.getSharedState();
            var propsToComponentMapping = state.propsToComponentMapping;
            var updated = Object.keys(propsToComponentMapping).reduce(function (acc, k) {
                var _a;
                return __assign({}, acc, (_a = {}, _a[k] = propsToComponentMapping[k].filter(function (f) {
                    return f.component.el != component.el;
                }), _a));
            }, {});
            that.setSharedState({
                propsToComponentMapping: updated
            });
            // console.log("after: ", that.getSharedState().propsToComponentMapping)
        });
        var propsToHandlerMapping = component.data;
        var state = this.getSharedState();
        var propsToComponentMapping = Object.keys(propsToHandlerMapping).reduce(function (acc, propKey) {
            var _a;
            var propComponentFunctions = state.propsToComponentMapping[propKey] || [];
            var callback = propsToHandlerMapping[propKey];
            return __assign({}, acc, (_a = {}, _a[propKey] = propComponentFunctions.concat([{
                component: component,
                callback: callback
            }]), _a));
        }, __assign({}, state.propsToComponentMapping));
        this.setSharedState({
            propsToComponentMapping: propsToComponentMapping
        });
        // console.log(this.getSharedState())
    };
    ReduxConnectedSystem.prototype.componentWillReceiveProps = function (props, nextProps) {
        var state = this.getSharedState();
        var propsToComponentMapping = state.propsToComponentMapping;
        Object.keys(propsToComponentMapping).forEach(function (k) {
            if (props[k] !== nextProps[k]) {
                // console.log("!! change detected for", k)
                // notify listeners for that change
                propsToComponentMapping[k].forEach(function (listener) {
                    listener.component.el.emit(listener.callback, {
                        oldState: props[k],
                        newState: nextProps[k]
                    });
                });
            }
        });
    };
    return ReduxConnectedSystem;
}(StoreAwareSystem);
exports.ReduxConnectedSystem = ReduxConnectedSystem;
function dispatch(component, action) {
    if (!component.el) {
        return;
    }
    var dispatcher = component.el["dispatch"];
    if (dispatcher) {
        dispatcher(action);
    }
}
exports.dispatch = dispatch;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var aframe_wrapper_1 = __webpack_require__(4);
exports.ComponentWrapper = aframe_wrapper_1.ComponentWrapper;
exports.SystemWrapper = aframe_wrapper_1.SystemWrapper;
var entity_builder_1 = __webpack_require__(5);
exports.EntityBuilder = entity_builder_1.EntityBuilder;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// helpers
Object.defineProperty(exports, "__esModule", { value: true });
var hasMethod = function (obj, name) {
    var desc = Object.getOwnPropertyDescriptor(obj, name);
    return !!desc && typeof desc.value === "function";
};
var getInstanceMethodNames = function (obj, stop) {
    var array = [];
    var proto = Object.getPrototypeOf(obj);
    while (proto && proto !== stop) {
        Object.getOwnPropertyNames(proto)
            .forEach(function (name) {
            if (name !== "constructor") {
                if (hasMethod(proto, name)) {
                    array.push(name);
                }
            }
        });
        proto = Object.getPrototypeOf(proto);
    }
    return array;
};
var ComponentWrapper = /** @class */ (function () {
    function ComponentWrapper(name, schema) {
        this.name = name;
        this.schema = schema || {};
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // default aframe core function implementations
    ComponentWrapper.prototype.remove = function () { };
    ComponentWrapper.prototype.update = function (oldData) { };
    ComponentWrapper.prototype.extendSchema = function (update) { };
    ComponentWrapper.prototype.flushToDOM = function () { };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // default aframe core function implementations
    ComponentWrapper.prototype.init = function () { };
    ComponentWrapper.prototype.pause = function () { };
    ComponentWrapper.prototype.play = function () { };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // special wrapper functions implementations
    ComponentWrapper.prototype.merge = function () {
        var _this = this;
        var funcs = getInstanceMethodNames(this, Object.prototype);
        funcs.forEach(function (k) { return _this[k] = _this[k]; });
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // special wrapper functions implementations
    ComponentWrapper.prototype.destroy = function () {
        var parent = this.el.parentElement;
        if (!!parent) {
            parent.removeChild(this.el);
        }
    };
    ComponentWrapper.prototype.register = function () {
        this.merge();
        AFRAME.registerComponent(this.name, this);
        return this;
    };
    ComponentWrapper.prototype.registerCallback = function (callbackName, fn) {
        this.el.addEventListener(callbackName, fn.bind(this));
    };
    return ComponentWrapper;
}());
exports.ComponentWrapper = ComponentWrapper;
var SystemWrapper = /** @class */ (function () {
    function SystemWrapper(name, schema) {
        this.name = name;
        this.schema = schema;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // default aframe core function implementations
    SystemWrapper.prototype.init = function () { };
    SystemWrapper.prototype.pause = function () { };
    SystemWrapper.prototype.play = function () { };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // special wrapper functions implementations
    SystemWrapper.prototype.merge = function () {
        var _this = this;
        var funcs = getInstanceMethodNames(this, Object.prototype);
        funcs.forEach(function (k) { return _this[k] = _this[k]; });
    };
    SystemWrapper.prototype.register = function () {
        this.merge();
        AFRAME.registerSystem(this.name, this);
    };
    return SystemWrapper;
}());
exports.SystemWrapper = SystemWrapper;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EntityBuilder = /** @class */ (function () {
    function EntityBuilder(type, attributes) {
        this.entity = document.createElement(type);
        if (attributes) {
            this.setAttributes(attributes);
        }
    }
    EntityBuilder.create = function (type, attributes, children) {
        var builder = new EntityBuilder(type, attributes);
        if (!!children) {
            children.forEach(function (c) {
                c.attachTo(builder.entity);
            });
        }
        return builder;
    };
    EntityBuilder.prototype.set = function (a, b, c) {
        if (!!b && !!c) {
            this.entity.setAttribute(a, b, c);
        }
        else if (!!b) {
            this.entity.setAttribute(a, b || "");
        }
        else {
            this.entity.setAttribute(a, "");
        }
        return this;
    };
    EntityBuilder.prototype.setAttributes = function (attributes) {
        var _this = this;
        Object.keys(attributes).forEach(function (k) {
            _this.set(k, attributes[k]);
        });
        return this;
    };
    EntityBuilder.prototype.toEntity = function () {
        return this.entity;
    };
    EntityBuilder.prototype.attachTo = function (parent) {
        if (!parent) {
            // attach to the scene by default
            document.querySelector("a-scene").appendChild(this.entity);
            return this;
        }
        // a parent was specified
        if ("el" in parent) {
            // there's an element in this parent; attach the entity
            // being created there
            parent.el.appendChild(this.entity);
        }
        else {
            // there isn't; attach directly
            if ("appendChild" in parent) {
                parent.appendChild(this.entity);
            }
            else {
                // parent.attach(this.entity)
            }
        }
        return this;
    };
    return EntityBuilder;
}());
exports.EntityBuilder = EntityBuilder;


/***/ })
],[1]);
});