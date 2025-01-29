"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataHolder = void 0;
exports.useElementIds = useElementIds;
exports.useElementDataById = useElementDataById;
var react_1 = require("react");
var DataHolder = /** @class */ (function () {
    function DataHolder(initialData) {
        this.dataById = {};
        this.listeners = [];
        this.data = initialData;
    }
    Object.defineProperty(DataHolder.prototype, "value", {
        get: function () {
            return this.data;
        },
        set: function (value) {
            this.data = value;
            this.dataById = {};
            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                var el = value_1[_i];
                this.dataById[el.id] = el;
            }
            this.notifyListeners();
        },
        enumerable: false,
        configurable: true
    });
    DataHolder.prototype.element = function (id) {
        return this.dataById[id];
    };
    DataHolder.prototype.addListener = function (listener) {
        var _this = this;
        this.listeners.push(listener);
        return function () {
            var index = _this.listeners.indexOf(listener);
            if (index >= 0) {
                _this.listeners.splice(index, 1);
            }
        };
    };
    DataHolder.prototype.notifyListeners = function () {
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener();
        }
    };
    return DataHolder;
}());
exports.DataHolder = DataHolder;
function useElementIds(controller) {
    var _a = (0, react_1.useState)(controller.data.value.map(function (el) { return el.id; })), ids = _a[0], setIds = _a[1];
    (0, react_1.useEffect)(function () {
        return controller.data.addListener(function () {
            var newIds = controller.data.value.map(function (el) { return el.id; });
            setIds(function (prevIds) {
                if (newIds.length != prevIds.length) {
                    return newIds;
                }
                for (var i = 0; i < newIds.length; i++) {
                    if (newIds[i] != prevIds[i]) {
                        return newIds;
                    }
                }
                return prevIds;
            });
        });
    }, [controller]);
    return ids;
}
function useElementDataById(controller, id) {
    var _a = (0, react_1.useState)(controller.data.element(id)), data = _a[0], setData = _a[1];
    (0, react_1.useEffect)(function () {
        return controller.data.addListener(function () {
            setData(controller.data.element(id));
        });
    }, [controller, id]);
    return data;
}
//# sourceMappingURL=controller.js.map