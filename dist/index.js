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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var manager_1 = __webpack_require__(2);
exports.Manager = manager_1.default;
var store_aware_1 = __webpack_require__(0);
exports.StoreAware = store_aware_1.default;

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
Object.defineProperty(exports, "__esModule", { value: true });
var store_aware_1 = __webpack_require__(0);
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

/***/ })
],[1]);