"use strict";
const DfiEventObject = require("./dfiEventObject");
const modelUniqueId = (() => {
    let nextId = 1;
    return () => {
        return nextId++;
    };
})();
const PROP_ATTRIBUTES = "attributes";
const PROP_ID_ATTRIBUTE = "idAttribute";
const PROP_ID = "id";
const PROP_LAST_UPDATE = "lastUpdate";
class DfiModel extends DfiEventObject {
    constructor(attributes, options) {
        options = options || {};
        if (!options.loggerName) {
            options.loggerName = "dfi:model:";
        }
        super(options);
        this.setProp(PROP_ATTRIBUTES, new Map());
        if (this.hasProp(PROP_ID_ATTRIBUTE) && this.has(this.getProp(PROP_ID_ATTRIBUTE))) {
            this.setProp(PROP_ID, this.get(this.getProp(PROP_ID_ATTRIBUTE)));
        }
        else if (Object.hasOwnProperty.call(attributes, PROP_ID)) {
            this.setProp(PROP_ID, attributes.id);
        }
        else {
            this.setProp(PROP_ID, options.loggerName + modelUniqueId());
        }
        this._getAttributeMap(attributes).forEach((target, source) => {
            if (attributes.hasOwnProperty(source)) {
                this.set(target, attributes[source], true);
            }
        });
        this.stampLastUpdate();
    }
    static get events() {
        return EVENTS;
    }
    get id() {
        return this.getProp(PROP_ID);
    }
    get lastUpdate() {
        return this.getProp(PROP_LAST_UPDATE);
    }
    toJSON() {
        let attr = { id: this.id };
        this.getProp(PROP_ATTRIBUTES).forEach((value, name) => {
            attr[name] = value;
        });
        return attr;
    }
    toPlain() {
        let attr = {};
        this.getProp(PROP_ATTRIBUTES).forEach((value, name) => {
            attr[name] = value;
        });
        let prop = super.toPlain();
        return { attr, prop };
    }
    destroy() {
        this.getProp(PROP_ATTRIBUTES).clear();
        super.destroy();
        this.destroyed = true;
    }
    get(attribute) {
        if (this.getProp(PROP_ATTRIBUTES)) {
            if (this.getProp(PROP_ATTRIBUTES).has(attribute)) {
                return this.getProp(PROP_ATTRIBUTES).get(attribute);
            }
        }
        return undefined;
    }
    has(attribute) {
        return this.getProp(PROP_ATTRIBUTES).has(attribute);
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
        this.getProp(PROP_ATTRIBUTES).set(attribute, value);
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
        let value = this.getProp(PROP_ATTRIBUTES).get(attribute);
        let ret = this.getProp(PROP_ATTRIBUTES).delete(attribute);
        this.emit(EVENTS.REMOVE, this, attribute, value);
        this.emit(EVENTS.UPDATE, this, attribute, value);
        return ret;
    }
    stampLastUpdate() {
        this.setProp(PROP_LAST_UPDATE, Date.now());
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