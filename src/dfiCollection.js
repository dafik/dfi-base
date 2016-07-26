"use strict";
const EventEmitter = require('eventemitter3'),
    DebugLogger = require('local-dfi-debug-logger');

class DfiCollection extends EventEmitter {


    constructor(model, idField) {
        super();
        this.collection = new Map();

        this.logger = new DebugLogger('dfi:collection:'+this.constructor.name);
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
        var res = this.collection.set(this._getId(element), element);
        this.emit('add', element, this.collection);
        this.emit('update', this.collection, element, 1);
        return res
    }

    remove(element) {
        var id;
        if (element instanceof this._model) {
            id = this._getId(element)
        } else {
            id = element;
        }
        element = this.collection.get(id);
        var res = this.collection.delete(id);
        this.emit('remove', element, this.collection);
        this.emit('update', this.collection, element, -1);
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
        this.emit('update', this.collection, null, 0);
        return this;
    }

    forEach(callback, thisArg) {
        return this.collection.forEach(callback, thisArg);
    }

    _getId(element) {
        return element[this._idField];
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
        return {size: this.collection.size, entries: this.collection.toJSON()};
    }

    get size() {
        return this.collection.size;
    }

    destroy() {

        this.removeAllListeners();
        delete this.collection;
        delete  this.logger;
    }

}

module.exports = DfiCollection