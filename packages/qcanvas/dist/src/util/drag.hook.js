"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDrag = useDrag;
var react_1 = require("react");
function useDrag(props) {
    var propsRef = (0, react_1.useRef)(props);
    propsRef.current = props;
    return {
        onMouseDown: (0, react_1.useCallback)(function (ev) {
            var _a, _b;
            var mouseMoveListener = function (ev) {
                var _a, _b;
                if (!propsRef.current.disabled) {
                    (_b = (_a = propsRef.current).onMouseMove) === null || _b === void 0 ? void 0 : _b.call(_a, ev);
                }
            };
            var mouseUpListener = function (ev) {
                var _a, _b;
                cleanup();
                if (!propsRef.current.disabled) {
                    (_b = (_a = propsRef.current).onMouseUp) === null || _b === void 0 ? void 0 : _b.call(_a, { cancelled: false });
                }
            };
            var keyDownListener = function (ev) {
                var _a, _b;
                if (ev.key === 'Escape') {
                    cleanup();
                    if (!propsRef.current.disabled) {
                        (_b = (_a = propsRef.current).onMouseUp) === null || _b === void 0 ? void 0 : _b.call(_a, { cancelled: true });
                    }
                }
            };
            var cleanup = function () {
                window.removeEventListener('mousemove', mouseMoveListener);
                window.removeEventListener('mouseup', mouseUpListener);
                window.removeEventListener('keydown', keyDownListener);
            };
            window.addEventListener('mousemove', mouseMoveListener);
            window.addEventListener('mouseup', mouseUpListener);
            window.addEventListener('keydown', keyDownListener);
            if (!propsRef.current.disabled) {
                (_b = (_a = propsRef.current).onMouseDown) === null || _b === void 0 ? void 0 : _b.call(_a, ev.nativeEvent);
                ev.stopPropagation();
            }
        }, [propsRef]),
    };
}
//# sourceMappingURL=drag.hook.js.map