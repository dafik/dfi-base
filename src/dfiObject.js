"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const local_dfi_debug_logger_1 = require("local-dfi-debug-logger");
const privateProperties = new WeakMap();
const PROP_LOGGER = "logger";
class DfiObject {
    get logger() {
        return privateProperties.get(this).get(PROP_LOGGER);
    }
    constructor(options) {
        privateProperties.set(this, new Map());
        options = options || {};
        this.setProp("logger", new local_dfi_debug_logger_1.default((options.loggerName ? options.loggerName : "dfi:object:") + this.constructor.name));
        for (const property in options) {
            if (options.hasOwnProperty(property)) {
                if (property !== "loggerName") {
                    this.setProp(property, options[property]);
                }
            }
        }
    }
    destroy() {
        privateProperties.get(this).clear();
        privateProperties.delete(this);
        this.destroyed = true;
    }
    toPlain() {
        const prop = {};
        const p = privateProperties.get(this);
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
exports.DfiObject = DfiObject;
exports.default = DfiObject;
//# sourceMappingURL=dfiObject.js.map