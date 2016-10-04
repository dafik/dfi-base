var debug = [
    '*'
];
process.env.DEBUG = debug.join(',');

import {DfiObject as DfiObject, DfiCollection, DfiModel} from "../index";


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
        } else {
            out[key] = entry;
        }
    });
    return out;
};

class o extends DfiObject {

}

class c extends DfiCollection {

}

class m extends DfiModel {

}

let o1 = new DfiObject();
let c1 = new DfiCollection();
let m1 = new DfiModel();

let o2 = new o();
let c2 = new c();
let m2 = new m();


let m3 = new m({a: 1, b: 2});
let fn = (model, attribute, value)=> {
    let x = 1;
};

m3.on(DfiModel.events.ADD, fn);
m3.set('test', 'test');

m3.off(DfiModel.events.ADD, fn);


o1.destroy();
o1.toPlain();
o2.destroy();
c1.destroy();
c2.destroy();
m1.destroy();
m2.destroy();
m3.destroy();

let x1 = process._getActiveHandles();

let x2 = process._getActiveRequests();


let x3 = 1;