"use strict";
const dfiObject_1 = require("./dfiObject");
const dfiModel_1 = require("./dfiModel");
class DfiCollection extends dfiObject_1.default {
    constructor(options) {
        options.loggerName = 'dfi:collection:';
        super(options);
        super.set('collection', new Map());
        super.set('proxyCallbacks', new Map());
        if (options.idField) {
            super.set('idField', options.idField);
        }
        if (options.model) {
            super.set('model', options.model);
        }
    }
    has(element) {
        let id;
        if (super.get('model') && element instanceof super.get('model')) {
            id = this._getId(element);
        }
        else {
            id = element;
        }
        return super.get('collection').has(id);
    }
    get(id) {
        return super.get('collection').get(id);
    }
    add(element) {
        let id = this._getId(element), res;
        if (!id) {
            this.logger.error('no id for model found');
        }
        else {
            if (!element.id) {
                element.id = id;
            }
            res = super.get('collection').set(id, element);
            element.on(dfiObject_1.default.events.ALL, this._onMemberAll, this);
            this.emit(DfiCollection.events.ADD, element, super.get('collection'));
            this.emit(DfiCollection.events.UPDATE, super.get('collection'), element, 1);
        }
        return res;
    }
    remove(element) {
        let id;
        if (element instanceof super.get('model')) {
            id = this._getId(element);
        }
        else {
            id = element;
        }
        element = super.get('collection').get(id);
        let res = false;
        if (element) {
            res = super.get('collection').delete(id);
            element.on(dfiObject_1.default.events.ALL, this._onMemberAll, this);
            this.emit(DfiCollection.events.DELETE, element, super.get('collection'));
            this.emit(DfiCollection.events.UPDATE, super.get('collection'), element, -1);
        }
        return res;
    }
    keys() {
        var keys = [];
        var iterator = super.get('collection').keys();
        for (let key of iterator) {
            keys.push(key);
        }
        return keys;
    }
    clear() {
        super.get('collection').clear();
        this.emit(DfiCollection.events.UPDATE, super.get('collection'), null, 0);
        return this;
    }
    forEach(callback, thisArg) {
        return super.get('collection').forEach(callback, thisArg);
    }
    _getId(element) {
        let idField = super.get('idField') || 'id';
        return element.get(idField);
    }
    toArray() {
        var entries = [];
        var iterator = super.get('collection').values();
        for (let value of iterator) {
            entries.push(value);
        }
        return entries;
    }
    toJSON() {
        let out = {
            size: super.get('collection').size,
            entries: Object.create(null)
        };
        super.get('collection').forEach((value, key) => {
            out['entries'][key] = value;
        });
        return out;
    }
    get size() {
        return super.get('collection').size;
    }
    destroy() {
        this.removeAllListeners();
        delete super.get('collection');
    }
    _onMemberAll(event) {
        if (super.get('proxyCallbacks').size > 0) {
            if (super.get('proxyCallbacks').has(event)) {
                let args = Array.prototype.slice.call(arguments);
                args.shift();
                let handlers = super.get('proxyCallbacks').get(event);
                handlers.forEach((handler) => {
                    handler.f.apply(handler.t, args);
                });
            }
            else if (super.get('proxyCallbacks').has(dfiObject_1.default.events.ALL)) {
                let args = Array.prototype.slice.call(arguments);
                let handlers = super.get('proxyCallbacks').get(dfiObject_1.default.events.ALL);
                handlers.forEach((handler) => {
                    handler.c.apply(handler.t, args);
                });
            }
        }
    }
    proxyOn(event, fn, context) {
        let proxyCallbacks = super.get('proxyCallbacks');
        if (!proxyCallbacks.has(event)) {
            proxyCallbacks.set(event, new Set());
        }
        let assigner = {
            c: fn,
            t: context,
        };
        let handlers = proxyCallbacks.get(event);
        handlers.add(assigner);
    }
    proxyOff(event, fn, context) {
        let handlers = super.get('proxyCallbacks').get(event);
        if (handlers) {
            handlers.forEach((handler) => {
                if ((handler.c == fn && handler.t == context) || !fn) {
                    handlers.delete(handler);
                }
            });
            if (handlers.size == 0) {
                super.get('proxyCallbacks').delete(event);
            }
        }
    }
    proxyOffAll() {
        super.get('proxyCallbacks').forEach((handlers, event) => {
            handlers.forEach((handler) => {
                this.proxyOff(event, handler.c, handler.t);
            });
        });
    }
    static get events() {
        return Events;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DfiCollection;
const Events = Object.assign(dfiModel_1.default.events, {
    ADD: Symbol(dfiObject_1.default.prototype.constructor.name + ':add'),
    DELETE: Symbol(dfiObject_1.default.prototype.constructor.name + ':delete'),
    UPDATE: Symbol(dfiObject_1.default.prototype.constructor.name + ':update')
});
//# sourceMappingURL=dfiCollection.js.map