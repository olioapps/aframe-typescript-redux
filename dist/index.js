webpackJsonp([0],[
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
var store_aware_1 = __webpack_require__(0);
var GenericPluralConnector = /** @class */function (_super) {
    __extends(GenericPluralConnector, _super);
    function GenericPluralConnector(store, props) {
        return _super.call(this, store, props) || this;
    }
    GenericPluralConnector.prototype.componentWillReceiveProps = function (props, nextProps) {
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
    return GenericPluralConnector;
}(store_aware_1.default);
var RepositoryConnector = /** @class */function (_super) {
    __extends(RepositoryConnector, _super);
    function RepositoryConnector(store, props) {
        return _super.call(this, store, props) || this;
    }
    RepositoryConnector.prototype.determineEntitiesToCreate = function (props, nextProps) {
        var oldR = this.getRepository(props);
        var newR = this.getRepository(nextProps);
        return newR.sort.filter(function (b) {
            return oldR.sort.indexOf(b) < 0;
        }).map(function (i) {
            return newR.items[i];
        });
    };
    RepositoryConnector.prototype.determineEntitiesToDestroy = function (props, nextProps) {
        var oldR = this.getRepository(props);
        var newR = this.getRepository(nextProps);
        return oldR.sort.filter(function (b) {
            return newR.sort.indexOf(b) < 0;
        }).map(function (i) {
            return oldR.items[i];
        });
    };
    RepositoryConnector.prototype.determineEntitiesToUpdate = function (props, nextProps) {
        var oldR = this.getRepository(props);
        var newR = this.getRepository(nextProps);
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
    return RepositoryConnector;
}(GenericPluralConnector);
exports.RepositoryConnector = RepositoryConnector;

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
var connectors_1 = __webpack_require__(1);
exports.RepositoryConnector = connectors_1.RepositoryConnector;
var store_aware_1 = __webpack_require__(0);
exports.StoreAware = store_aware_1.default;
var store_aware_component_1 = __webpack_require__(4);
exports.StoreAwareComponent = store_aware_component_1.StoreAwareComponent;
exports.StoreAwareRepositoryComponent = store_aware_component_1.StoreAwareRepositoryComponent;

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
var store_aware_1 = __webpack_require__(0);
var connectors_1 = __webpack_require__(1);
/**
 * Maintains a 1:1 relationship between a store object we want to watch, and
 * an aframe entity component instance
 */
var StoreAwareRepositoryComponent = /** @class */function (_super) {
    __extends(StoreAwareRepositoryComponent, _super);
    function StoreAwareRepositoryComponent(store, name, props, schema) {
        var _this = _super.call(this, name, schema) || this;
        _this.entities = new Map();
        var that = _this;
        _this.storeAware = new ( /** @class */function (_super) {
            __extends(Connector, _super);
            function Connector(store, props) {
                return _super.call(this, store, props) || this;
            }
            Connector.prototype.getRepository = function (props) {
                return that.resolveRepository(props);
            };
            Connector.prototype.destroyEntity = function (entity) {
                that.destroyEntity(entity);
            };
            Connector.prototype.createEntity = function (entity) {
                that.createEntity(entity);
            };
            Connector.prototype.updateEntity = function (entity) {
                that.updateEntity(entity);
            };
            return Connector;
        }(connectors_1.RepositoryConnector))(store, props);
        _this.store = store;
        return _this;
    }
    StoreAwareRepositoryComponent.prototype.componentShouldUpdate = function (props, nextProps) {
        // override
        return true;
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
        return this.entities.get(id);
    };
    StoreAwareRepositoryComponent.prototype.updateEntityComponents = function (id, w) {
        this.entities.set(id, w);
    };
    //
    // -- aframe component lifecycle functions
    //
    /**
     * by default, register aframe component instance
     */
    StoreAwareRepositoryComponent.prototype.init = function () {
        var storeObject = this.resolveStoreObject(this.data);
        this.updateEntityComponents(storeObject.id, this);
    };
    return StoreAwareRepositoryComponent;
}(aframe_typescript_toolkit_1.ComponentWrapper);
exports.StoreAwareRepositoryComponent = StoreAwareRepositoryComponent;
var StoreAwareComponent = /** @class */function (_super) {
    __extends(StoreAwareComponent, _super);
    function StoreAwareComponent(store, name, props, schema) {
        var _this = _super.call(this, name, schema) || this;
        _this.entities = new Map();
        var that = _this;
        _this.storeAware = new ( /** @class */function (_super) {
            __extends(Connector, _super);
            function Connector(store, props) {
                return _super.call(this, store, props) || this;
            }
            Connector.prototype.componentWillReceiveProps = function (props, nextProps) {
                that.componentWillReceiveProps(props, nextProps);
            };
            return Connector;
        }(store_aware_1.default))(store, props);
        _this.store = store;
        return _this;
    }
    StoreAwareComponent.prototype.init = function () {
        console.log(this);
        this.entities.set("entity", this);
    };
    StoreAwareComponent.prototype.getComponent = function () {
        return this.entities.get("entity");
    };
    return StoreAwareComponent;
}(aframe_typescript_toolkit_1.ComponentWrapper);
exports.StoreAwareComponent = StoreAwareComponent;

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