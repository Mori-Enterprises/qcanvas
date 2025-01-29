"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollContainer = exports.DisplayContext = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importDefault(require("react"));
exports.DisplayContext = react_1.default.createContext(undefined);
var ScrollContainer = function (_a) {
    var container = _a.container, children = _a.children;
    var _b = react_1.default.useState({
        left: 0,
        top: 0,
        zoom: 1,
    }), display = _b[0], setDisplay = _b[1];
    var _c = react_1.default.useState(null), scrollContainer = _c[0], setScrollContainer = _c[1];
    react_1.default.useEffect(function () {
        if (!container || !scrollContainer) {
            return;
        }
        var wheelListener = function (ev) {
            ev.preventDefault();
            if (ev.ctrlKey) {
                setDisplay(function (prev) {
                    if (prev.zoom < 0.1 || prev.zoom > 3) {
                        return prev;
                    }
                    var scrollRect = scrollContainer.getBoundingClientRect();
                    var scrollX = ev.pageX - scrollRect.left;
                    var scrollY = ev.pageY - scrollRect.top;
                    var containerRect = container.getBoundingClientRect();
                    var containerX = ev.pageX - containerRect.left;
                    var containerY = ev.pageY - containerRect.top;
                    var newZoom = Math.max(0.1, Math.min(3, prev.zoom + ev.deltaY * -0.01));
                    var logicalX = scrollX / prev.zoom;
                    var logicalY = scrollY / prev.zoom;
                    return __assign(__assign({}, prev), { left: containerX / newZoom - logicalX, top: containerY / newZoom - logicalY, zoom: newZoom });
                });
            }
            else {
                setDisplay(function (prev) { return (__assign(__assign({}, prev), { left: prev.left + (ev.deltaX / prev.zoom), top: prev.top + (ev.deltaY / prev.zoom) })); });
            }
        };
        container.addEventListener('wheel', wheelListener, { passive: false });
        return function () { return container.removeEventListener('wheel', wheelListener); };
    }, [container, scrollContainer]);
    var displayRef = react_1.default.useRef(display);
    displayRef.current = display;
    return (0, jsx_runtime_1.jsx)("div", { ref: setScrollContainer, style: {
            position: 'relative',
            minWidth: '100%',
            minHeight: '100%',
            transform: "scale(".concat(display.zoom, ") translate(").concat(display.left, "px, ").concat(display.top, "px)"),
            transformOrigin: 'top left',
        }, children: (0, jsx_runtime_1.jsx)(exports.DisplayContext.Provider, { value: displayRef, children: children }) });
};
exports.ScrollContainer = ScrollContainer;
//# sourceMappingURL=ScrollContainer.js.map