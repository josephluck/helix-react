"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helix_js_1 = require("helix-js");
const yoyo = require("yo-yo");
exports.html = yoyo;
function renderer(dom) {
    let _dom = dom;
    return function (node, state, prev, actions) {
        if (node) {
            _dom = exports.html.update(_dom, node(state, prev, actions));
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
