"use strict";
const DebugLogger = require("local-dfi-debug-logger");
let privateProperties = new WeakMap();
const PROP_LOGGER = "logger";
class DfiObject {
    constructor(options) {
        privateProperties.set(this, new Map());
        options = options || {};
        this.setProp("logger", new DebugLogger((options.loggerName ? options.loggerName : "dfi:object:") + this.constructor.name));
        for (let property in options) {
            if (options.hasOwnProperty(property)) {
                if (property !== "loggerName") {
                    this.setProp(property, options[property]);
                }
            }
        }
    }
    get logger() {
        return privateProperties.get(this).get(PROP_LOGGER);
    }
    destroy() {
        privateProperties.get(this).clear();
        privateProperties.delete(this);
        this.destroyed = true;
    }
    toPlain() {
        let prop = {};
        let p = privateProperties.get(this);
        if (p) {
            p.forEach((value, name) => {
                if (name !== "attributes") {
                    prop[name] = value;
                }
            });
        }
        return prop;
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
}
module.exports = DfiObject;
//# sourceMappingURL=dfiObject.js.map