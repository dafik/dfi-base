"use strict";
const DfiObject = require('./dfiObject'),
    DebugLogger = require('local-dfi-debug-logger');

class DfiCollection extends DfiObject {


    constructor(options) {
        super();
        this.collection = new Map();

        if (options.idField) {
            super.set('idField', options.idField);
        }
        if (options.model) {
            super.set('model', options.model);
        }

        super.set('logger', new DebugLogger((options.loggerName ? options.loggerName : 'dfi:collection:') + this.constructor.name));
    }

    has(element) {
        var id;
        if (this._model && element instanceof this._model) {
            id = this._getId(element)
        } else {
            id = element;
        }
        return this.collection.has(id);
    }

    get(id) {
        return this.collection.get(id);
    }

    add(element) {
        let id = this._getId(element), res;
        if (!id) {
            this.logger.error('no id for model found');
        } else {
            if (!element.id) {
                element.id = id;
            }
            res = this.collection.set(id, element);
        }
        this.emit(Events.ADD, element, this.collection);
        this.emit(Events.UPDATE, this.collection, element, 1);
        return res
    }

    remove(element) {
        var id;
        if (element instanceof super.get('model')) {
            id = this._getId(element)
        } else {
            id = element;
        }
        element = this.collection.get(id);
        var res = false;
        if (element) {
            res = this.collection.delete(id);
            this.emit(Events.REMOVE, element, this.collection);
            this.emit(Events.UPDATE, this.collection, element, -1);
        }
        return res
    }

    keys() {
        var keys = [];
        var iterator = this.collection.keys();

        for (let key of iterator) {
            keys.push(key);
        }
        return keys;
    }

    clear() {
        this.collection.clear();
        this.emit(Events.UPDATE, this.collection, null, 0);
        return this;
    }

    forEach(callback, thisArg) {
        return this.collection.forEach(callback, thisArg);
    }

    _getId(element) {
        let idField = super.get('idField') || 'id';
        return element.get(idField);
    }

    toArray() {
        var entries = [];
        var iterator = this.collection.values();

        for (let value of iterator) {
            entries.push(value);
        }
        return entries;
    }

    toJSON() {
        let out = {
            size: this.collection.size,
            entries: Object.create(null)
        };
        this.collection.forEach((value, key)=> {
            out['entries'][key] = value
        });


        return out;
    }

    get size() {
        return this.collection.size;
    }

    destroy() {
        this.removeAllListeners();
        delete this.collection;
    }

    /**
     * @returns {{ADD,UPDATE,REMOVE,ALL,DESTROY}}
     */
    static get events() {
        return Events;
    }
}

let events = Object.create(null);
for (let name in DfiObject.events) {
    events[name] = DfiObject.events[name];
}

events['ADD'] = Symbol('collection:add');
events['REMOVE'] = Symbol('collection:remove');
events['UPDATE'] = Symbol('collection:update');

const Events = events;

module.exports = DfiCollection;