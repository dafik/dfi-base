"use strict";
const DfiEventObject = require("./dfiEventObject");
const MODEL_UNIQUE_ID = (() => {
    let nextId = 1;
    return () => {
        return nextId++;
    };
})();
class DfiModel extends DfiEventObject {
    /**
     * @param attributes
     * @param options
     * @param notMakeStamp
     */
    constructor(attributes, options, notMakeStamp) {
        options = options || {};
        if (!options.loggerName) {
            options.loggerName = "dfi:model:";
        }
        super(options);
        this.setProp("attributes", new Map());
        this._getAttributeMap(attributes).forEach((target, source) => {
            if (attributes.hasOwnProperty(source)) {
                this.set(target, attributes[source], true);
            }
        });
        if (this.hasProp("idAttribute") && this.has(this.getProp("idAttribute"))) {
            this.setProp("id", this.get(this.getProp("idAttribute")));
        }
        else if (this.has("id")) {
            this.setProp("id", this.get("id"));
        }
        else if (Object.hasOwnProperty.call(attributes, "id")) {
            this.setProp("id", attributes.id);
        }
        else {
            this.setProp("id", options.loggerName + MODEL_UNIQUE_ID());
        }
        if (!notMakeStamp) {
            this.stampLastUpdate();
        }
    }
    get id() {
        return this.getProp("id");
    }
    get lastUpdate() {
        return this.getProp("lastUpdate");
    }
    stampLastUpdate(time) {
        if (time) {
            this.setProp("lastUpdate", time);
        }
        else {
            this.setProp("lastUpdate", Date.now());
        }
    }
    toJSON() {
        let attr = { id: this.id };
        this.getProp("attributes").forEach((value, name) => {
            attr[name] = value;
        });
        return attr;
    }
    toPlain() {
        let attr = {};
        this.getProp("attributes").forEach((value, name) => {
            attr[name] = value;
        });
        let prop = {};
        this.__getProp().forEach((value, name) => {
            if (name !== "attributes") {
                prop[name] = value;
            }
        });
        return { attr, prop };
    }
    destroy() {
        this.getProp("attributes").clear();
        super.destroy();
        this.destroyed = true;
    }
    get(attribute) {
        if (this.getProp("attributes")) {
            if (this.getProp("attributes").has(attribute)) {
                return this.getProp("attributes").get(attribute);
            }
        }
        return undefined;
    }
    has(attribute) {
        return this.getProp("attributes").has(attribute);
    }
    set(attribute, value, silent) {
        if (typeof attribute === "object") {
            silent = value;
            for (let attr in attribute) {
                if (attribute.hasOwnProperty(attr)) {
                    this.set(attr, attribute[attr], silent);
                }
            }
            return this;
        }
        let old = this.get(attribute);
        if (old === value) {
            return;
        }
        this.getProp("attributes").set(attribute, value);
        this.stampLastUpdate();
        if (silent !== true) {
            if (old === undefined) {
                this.emit(EVENTS.ADD, this, attribute, value);
            }
            this.emit(EVENTS.UPDATE, this, attribute, value, old);
        }
        return this;
    }
    remove(attribute) {
        let value = this.getProp("attributes").get(attribute);
        let ret = this.getProp("attributes").delete(attribute);
        this.emit(EVENTS.REMOVE, this, attribute, value);
        this.emit(EVENTS.UPDATE, this, attribute, value);
        return ret;
    }
    static get events() {
        return EVENTS;
    }
    _getAttributeMap(attributes) {
        if (this.constructor.map) {
            return this.constructor.map;
        }
        else {
            let result = new Map();
            let keys = Object.keys(attributes);
            for (let i = 0, length = keys.length; i < length; i++) {
                result.set(keys[i], keys[i]);
            }
            return result;
        }
    }
}
const EVENTS = Object.assign(Object.assign({}, DfiEventObject.events), {
    ADD: Symbol(DfiModel.prototype.constructor.name + ":add"),
    REMOVE: Symbol(DfiModel.prototype.constructor.name + ":delete"),
    UPDATE: Symbol(DfiModel.prototype.constructor.name + ":update")
});
module.exports = DfiModel;
//# sourceMappingURL=dfiModel.js.map