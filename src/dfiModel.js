"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dfiEventObject_1 = require("./dfiEventObject");
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
class DfiModel extends dfiEventObject_1.default {
    static get events() {
        return EVENTS;
    }
    get id() {
        return this.getProp(PROP_ID);
    }
    get lastUpdate() {
        return this.getProp(PROP_LAST_UPDATE);
    }
    constructor(attributes, options) {
        options = options || {};
        if (!options.loggerName) {
            options.loggerName = "dfi:model:";
        }
        super(options);
        this.setProp(PROP_ATTRIBUTES, new Map());
        this._getAttributeMap(attributes).forEach((target, source) => {
            if (attributes.hasOwnProperty(source)) {
                this.set(target, attributes[source], true);
            }
        });
        if (this.hasProp(PROP_ID_ATTRIBUTE) && this.has(this.getProp(PROP_ID_ATTRIBUTE))) {
            this.setProp(PROP_ID, this.get(this.getProp(PROP_ID_ATTRIBUTE)));
        }
        else if (Object.hasOwnProperty.call(attributes, PROP_ID)) {
            this.setProp(PROP_ID, attributes.id);
        }
        else {
            this.setProp(PROP_ID, options.loggerName + modelUniqueId());
        }
        this.stampLastUpdate();
    }
    destroy() {
        this.getProp(PROP_ATTRIBUTES).clear();
        super.destroy();
        this.destroyed = true;
    }
    toJSON() {
        const attr = { id: this.id };
        this.getProp(PROP_ATTRIBUTES).forEach((value, name) => {
            attr[name] = value;
        });
        return attr;
    }
    toPlain() {
        const attr = {};
        this.getProp(PROP_ATTRIBUTES).forEach((value, name) => {
            attr[name] = value;
        });
        const prop = super.toPlain();
        return { attr, prop };
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
            for (const attr in attribute) {
                if (attribute.hasOwnProperty(attr)) {
                    this.set(attr, attribute[attr], silent);
                }
            }
            return this;
        }
        const old = this.get(attribute);
        if (old === value) {
            return;
        }
        this.getProp(PROP_ATTRIBUTES).set(attribute, value);
        this.stampLastUpdate();
        if (silent !== true) {
            if (old === undefined) {
                this.emit(DfiModel.events.ADD, this, attribute, value);
            }
            this.emit(DfiModel.events.UPDATE, this, attribute, value, old);
        }
        return this;
    }
    remove(attribute) {
        const value = this.getProp(PROP_ATTRIBUTES).get(attribute);
        const ret = this.getProp(PROP_ATTRIBUTES).delete(attribute);
        this.emit(DfiModel.events.REMOVE, this, attribute, value);
        this.emit(DfiModel.events.UPDATE, this, attribute, value);
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
            const result = new Map();
            const keys = Object.keys(attributes);
            for (let i = 0, length = keys.length; i < length; i++) {
                result.set(keys[i], keys[i]);
            }
            return result;
        }
    }
}
exports.DfiModel = DfiModel;
exports.default = DfiModel;
const EVENTS = Object.assign({}, dfiEventObject_1.default.events, { ADD: Symbol(DfiModel.prototype.constructor.name + ":add"), REMOVE: Symbol(DfiModel.prototype.constructor.name + ":delete"), UPDATE: Symbol(DfiModel.prototype.constructor.name + ":update") });
//# sourceMappingURL=dfiModel.js.map