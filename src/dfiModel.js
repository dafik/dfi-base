"use strict";
const dfiObject_1 = require("./dfiObject");
class DfiModel extends dfiObject_1.default {
    constructor(attributes, options) {
        options.loggerName = 'dfi:model:';
        super(options);
        this.attributes = new Map();
        for (let attribute in attributes) {
            this.set(attribute, attributes[attribute]);
        }
        for (let property in options) {
            this.setProp(property, options[property]);
        }
        if (this.hasProp('idAttribute') && this.has(this.getProp('idAttribute'))) {
            this.id = this.get(this.getProp('idAttribute'));
        }
        this.stampLastUpdate();
    }
    getLastUpdateMillis() {
        return super.get('lastUpdate');
    }
    stampLastUpdate() {
        this.setProp('lastUpdate', Date.now());
    }
    destroy() {
        super.destroy();
        this.attributes.clear();
        delete this.attributes;
        this.destroyed = true;
    }
    get(attribute) {
        if (this.attributes) {
            if (this.attributes.has(attribute)) {
                return this.attributes.get(attribute);
            }
        }
        else {
            let ee = 1;
        }
        return undefined;
    }
    has(attribute) {
        return this.attributes.has(attribute);
    }
    set(attribute, value, silent) {
        if (typeof attribute == 'object') {
            silent = value;
            for (let attr in attribute) {
                if (attribute.hasOwnProperty(attr)) {
                    this.set(attr, attribute[attr], silent);
                }
            }
            return this;
        }
        var old = this.get(attribute);
        let ret = this.attributes.set(attribute, value);
        this.stampLastUpdate();
        if (silent != true) {
            if (old == undefined) {
                this.emit(Events.ADD, this, attribute, value);
            }
            this.emit(Events.UPDATE, this, attribute, value, old);
        }
        return this;
    }
    delete(attribute) {
        let value = this.attributes.get(attribute);
        let ret = this.attributes.delete(attribute);
        this.emit(Events.DELETE, this, attribute, value);
        this.emit(Events.UPDATE, this, attribute, value);
        return ret;
    }
    getProp(key) {
        return super.get(key);
    }
    setProp(key, value) {
        return super.set(key, value);
    }
    hasProp(key) {
        return super.has(key);
    }
    deleteProp(key) {
        return super.delete(key);
    }
    static get events() {
        return Events;
    }
    toJSON() {
        let attr = {};
        this.attributes.forEach((value, name) => {
            attr[name] = value;
        });
        return attr;
    }
    toPlain() {
        let attr = {};
        this.attributes.forEach((value, name) => {
            attr[name] = value;
        });
        let prop = {};
        this.__getProp().forEach((value, name) => {
            prop[name] = value;
        });
        return { attr: attr, prop: prop };
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DfiModel;
const Events = Object.assign(DfiModel.events, {
    ADD: Symbol(dfiObject_1.default.prototype.constructor.name + ':add'),
    DELETE: Symbol(dfiObject_1.default.prototype.constructor.name + ':delete'),
    UPDATE: Symbol(dfiObject_1.default.prototype.constructor.name + ':update')
});
//# sourceMappingURL=dfiModel.js.map