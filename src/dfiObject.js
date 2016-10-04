"use strict";
const DebugLogger = require("local-dfi-debug-logger/debugLogger");
var privateProperties = new WeakMap();
class DfiObject {
    constructor(options) {
        privateProperties.set(this, new Map());
        options = options || {};
        this.setProp('logger', new DebugLogger((options.loggerName ? options.loggerName : 'dfi:object:') + this.constructor.name));
        for (let property in options) {
            if (property != 'loggerName' && options.hasOwnProperty(property)) {
                this.setProp(property, options[property]);
            }
        }
    }

    get options() {
        return privateProperties.get(this).get('options');
    }

    get logger() {
        return privateProperties.get(this).get('logger');
    }

    getProp(key) {
        return privateProperties.get(this).get(key);
    }

    setProp(key, value) {
        privateProperties.get(this).set(key, value);
        return this;
    }

    hasProp(key) {
        return privateProperties.get(this).has(key);
    }

    removeProp(key) {
        return privateProperties.get(this).delete(key);
    }

    destroy() {
        privateProperties.get(this).clear();
        privateProperties.delete(this);
        this.destroyed = true;
    }

    __getProp() {
        return privateProperties.get(this);
    }

    toPlain() {
        let prop = {};
        let p = this.__getProp();
        if (p) {
            p.forEach((value, name) => {
                if (name !== 'attributes') {
                    prop[name] = value;
                }
            });
        }
        return prop;
    }
}
module.exports = DfiObject;
//# sourceMappingURL=dfiObject.js.map