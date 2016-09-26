"use strict";
const
    DebugLogger = require('local-dfi-debug-logger'),
    DfiObject = require('./dfiObject');

/**
 * @class
 * @extends DfiObject
 * @extends EventEmitter
 * @extends EE
 */

class DfiModel extends DfiObject {
    /**
     * @param {{}} attributes
     * @param {{}} options
     */
    constructor(attributes, options) {
        super();

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
        this.setProp('logger', new DebugLogger('dfi:model:' + this.constructor.name));


        this.stampLastUpdate();

        this.initialize();
    }

    getLastUpdateMillis() {
        return super.get('lastUpdate');
    }

    stampLastUpdate() {
        this.setProp('lastUpdate', Date.now());
    }


    initialize() {

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
        } else {
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
                    this.set(attr, attribute[attr], silent)
                }
            }
            return this;
        }
        var old = this.get(attribute);
        this.attributes.set(attribute, value);
        this.stampLastUpdate();
        if (silent != true) {
            if (old == undefined) {
                this.emit(Events.ADD, this, attribute, value);
            }
            this.emit(Events.UPDATE, this, attribute, value, old);
        }
        return this;

    }

    //noinspection ReservedWordAsName
    delete(attribute) {
        let value = this.attributes.get(attribute);
        this.attributes.delete(attribute);

        this.emit(Events.DELETE, this, attribute, value);
        this.emit(Events.UPDATE, this, attribute, value);
        return this
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


    /**
     * @returns {{ADD,DELETE,UPDATE,ALL,DESTROY}}
     */
    static get events() {
        return Events;
    }

    toJSON() {
        let attr = {};
        this.attributes.forEach((value, name) => {
            attr[name] = value
        });
        return attr
    }

    toPlain() {
        let attr = {};
        this.attributes.forEach((value, name) => {
            attr[name] = value
        });

        let prop = {};
        this.__getProp().forEach((value, name) => {
            prop[name] = value
        });
        return {attr: attr, prop: prop};
    }
}

let events = Object.create(null);
for (let name in DfiObject.events) {
    events[name] = DfiObject.events[name];
}

events['ADD'] = Symbol(DfiObject.prototype.constructor.name + ':add');
events['DELETE'] = Symbol(DfiObject.prototype.constructor.name + ':delete');
events['UPDATE'] = Symbol(DfiObject.prototype.constructor.name + ':update');

const Events = events;


module.exports = DfiModel;