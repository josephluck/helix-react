"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helix_js_1 = require("helix-js");
const dom = require("react-dom");
function renderer(elm) {
    return function (node, state, prev, actions) {
        if (node) {
            dom.render(node(state, prev, actions), elm);
        }
    };
}
function default_1(opts) {
    const config = Object.assign({}, opts, {
        render: renderer(opts.mount),
    });
    return helix_js_1.default(config);
}
exports.default = default_1;
