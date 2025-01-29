"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Canvas = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importDefault(require("react"));
var controller_1 = require("./controller");
var ScrollContainer_1 = require("./ScrollContainer");
var Element_1 = require("./Element");
;
var Canvas = function (_a) {
    var controller = _a.controller, componentFactory = _a.componentFactory;
    var ids = (0, controller_1.useElementIds)(controller);
    var _b = react_1.default.useState(null), el = _b[0], setEl = _b[1];
    return (0, jsx_runtime_1.jsx)("div", { ref: setEl, style: {
            width: '100%',
            height: '100%',
            overflow: 'hidden',
        }, children: (0, jsx_runtime_1.jsx)(ScrollContainer_1.ScrollContainer, { container: el, children: ids.map(function (id) { return (0, jsx_runtime_1.jsx)(Element_1.Element, { id: id, controller: controller, componentFactory: componentFactory }, id); }) }) });
};
exports.Canvas = Canvas;
//# sourceMappingURL=Canvas.js.map