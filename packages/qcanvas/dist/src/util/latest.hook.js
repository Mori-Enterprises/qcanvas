"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLatest = useLatest;
var react_1 = require("react");
function useLatest(val) {
    var ref = (0, react_1.useRef)(val);
    ref.current = val;
    return ref;
}
//# sourceMappingURL=latest.hook.js.map