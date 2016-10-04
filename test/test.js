"use strict";
var debug = [
    '*'
];
process.env.DEBUG = debug.join(',');
const index_1 = require("../index");
Set.prototype.toJSON = function () {
    var out = [];
    this.forEach(function (entry) {
        out.push(entry);
    });
    return out;
};
Map.prototype.toJSON = function () {
    var out = {};
    this.forEach(function (entry, key) {
        if (entry.toJSON) {
            out[key] = entry.toJSON();
        }
        else {
            out[key] = entry;
        }
    });
    return out;
};
class o extends index_1.DfiObject {
}
class c extends index_1.DfiCollection {
}
class m extends index_1.DfiModel {
}
let o2 = new o();
let c2 = new c();
let m2 = new m();
let m3 = new m({ a: 1, b: 2 });
let fn = (model, attribute, value) => {
    let x = 1;
};
m3.on(index_1.DfiModel.events.ADD, fn);
m3.set('test', 'test');
m3.off(index_1.DfiModel.events.ADD, fn);
o2.destroy();
c2.destroy();
m2.destroy();
m3.destroy();
let x1 = process._getActiveHandles();
let x2 = process._getActiveRequests();
let x3 = 1;
//# sourceMappingURL=test.js.map