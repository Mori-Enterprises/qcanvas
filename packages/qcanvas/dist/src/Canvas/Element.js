"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Element = void 0;
exports.useElementContext = useElementContext;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var drag_hook_1 = require("../util/drag.hook");
var math_1 = require("../util/math");
var latest_hook_1 = require("../util/latest.hook");
var ScrollContainer_1 = require("./ScrollContainer");
var DRAG_SLOP = 5;
function useElementDataFromDataController(data, id) {
    var _a = react_1.default.useState(data.element(id)), elData = _a[0], setElData = _a[1];
    react_1.default.useEffect(function () {
        return data.addListener(function () {
            setElData(function (prevData) {
                var newData = data.element(id);
                if (prevData === newData) {
                    return prevData;
                }
                else {
                    return newData;
                }
            });
        });
    }, [data, id]);
    return elData;
}
var ElementDataContext = react_1.default.createContext(undefined);
function useElementContext() {
    return react_1.default.useContext(ElementDataContext);
}
;
exports.Element = react_1.default.memo(function (_a) {
    var id = _a.id, controller = _a.controller, componentFactory = _a.componentFactory;
    var data = useElementDataFromDataController(controller.data, id);
    var kind = data.kind, x = data.x, y = data.y, draggable = data.draggable, clickable = data.clickable;
    var dragState = react_1.default.useRef();
    var _b = react_1.default.useState(false), isDragging = _b[0], setIsDragging = _b[1];
    var idRef = (0, latest_hook_1.useLatest)(id);
    var xRef = (0, latest_hook_1.useLatest)(x);
    var yRef = (0, latest_hook_1.useLatest)(y);
    var displayRef = (0, react_1.useContext)(ScrollContainer_1.DisplayContext);
    var onMouseDown = (0, drag_hook_1.useDrag)({
        onMouseDown: react_1.default.useCallback(function (ev) {
            dragState.current = {
                startScreenX: ev.screenX,
                startScreenY: ev.screenY,
            };
        }, [controller]),
        onMouseMove: react_1.default.useCallback(function (ev) {
            var _a, _b;
            if (!dragState.current) {
                return;
            }
            var _c = dragState.current, startScreenX = _c.startScreenX, startScreenY = _c.startScreenY;
            if (!dragState.current.dragging && (0, math_1.dist)(startScreenX, startScreenY, ev.screenX, ev.screenY) >= DRAG_SLOP) {
                dragState.current.dragging = true;
                controller === null || controller === void 0 ? void 0 : controller.onElementDragStart(idRef.current, xRef.current, yRef.current);
                setIsDragging(true);
            }
            if (dragState.current.dragging) {
                var deltaX = (ev.screenX - startScreenX) / ((_a = displayRef === null || displayRef === void 0 ? void 0 : displayRef.current.zoom) !== null && _a !== void 0 ? _a : 1);
                var deltaY = (ev.screenY - startScreenY) / ((_b = displayRef === null || displayRef === void 0 ? void 0 : displayRef.current.zoom) !== null && _b !== void 0 ? _b : 1);
                controller === null || controller === void 0 ? void 0 : controller.onElementDrag(idRef.current, deltaX, deltaY);
            }
        }, [controller, displayRef]),
        onMouseUp: react_1.default.useCallback(function (props) {
            var _a;
            if ((_a = dragState.current) === null || _a === void 0 ? void 0 : _a.dragging) {
                setIsDragging(false);
                controller === null || controller === void 0 ? void 0 : controller.onElementDragEnd(idRef.current, {
                    cancelled: !!props.cancelled,
                });
            }
            dragState.current = undefined;
        }, [controller]),
        disabled: !draggable,
    }).onMouseDown;
    var onClick = react_1.default.useCallback(function (ev) {
        if (clickable) {
            controller.onElementClick(ev.nativeEvent, id);
        }
    }, [controller, id, clickable]);
    return (0, jsx_runtime_1.jsx)("div", { style: {
            position: 'absolute',
            userSelect: draggable ? 'none' : undefined,
            willChange: isDragging ? 'transform' : undefined,
            transform: "translate(".concat(x, "px, ").concat(y, "px)"),
        }, onClick: onClick, onMouseDown: onMouseDown, children: (0, jsx_runtime_1.jsx)(ElementDataContext.Provider, { value: data, children: componentFactory(kind) }) });
});
//# sourceMappingURL=Element.js.map