"use strict";
exports.__esModule = true;
var helix_js_1 = require("helix-js");
var dom = require("react-dom");
function renderer(elm) {
    return function (node, state, prev, actions) {
        if (node) {
            dom.render(node(state, prev, actions), elm);
        }
    };
}
function default_1(opts) {
    var config = Object.assign({}, opts, {
        render: renderer(opts.mount)
    });
    return helix_js_1["default"](config);
}
exports["default"] = default_1;
