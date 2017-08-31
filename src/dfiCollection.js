"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dfiEventObject_1 = require("./dfiEventObject");
const PROP_COLLECTION = "collection";
const PROP_PROXY_CALLBACKS = "proxyCallbacks";
const PROP_ID_FIELD = "idField";
const PROP_MODEL = "model";
class DfiCollection extends dfiEventObject_1.default {
    constructor(options) {
        options = options || {};
        if (!options.loggerName) {
            options.loggerName = "dfi:collection:";
        }
        super(options);
        this.setProp(PROP_COLLECTION, new Map());
        this.setProp(PROP_PROXY_CALLBACKS, new Map());
        if (options.idField) {
            this.setProp(PROP_ID_FIELD, options.idField);
        }
        if (options.model) {
            this.setProp(PROP_MODEL, options.model);
        }
    }
    static get events() {
        return EVENTS;
    }
    get size() {
        return this.getProp(PROP_COLLECTION).size;
    }
    get _proxyHandlers() {
        return this.getProp(PROP_PROXY_CALLBACKS);
    }
    destroy() {
        this.removeAllListeners();
        this.clear();
        this.proxyOffAll();
        super.destroy();
    }
    toJSON() {
        const out = {
            entries: Object.create(null),
            size: this.getProp(PROP_COLLECTION).size
        };
        this.getProp(PROP_COLLECTION).forEach((value, key) => {
            out.entries[key] = value;
        });
        return out;
    }
    has(element) {
        const id = (this.getProp(PROP_MODEL) && element instanceof this.getProp(PROP_MODEL)) ? element.id : element;
        return this.getProp(PROP_COLLECTION).has(id);
    }
    get(id) {
        return this.getProp(PROP_COLLECTION).get(id);
    }
    add(element) {
        this.getProp(PROP_COLLECTION).set(element.id, element);
        element.on(dfiEventObject_1.default.events.ALL, this._onMemberAll, this);
        this.emit(DfiCollection.events.ADD, element, this.getProp(PROP_COLLECTION));
        this.emit(DfiCollection.events.UPDATE, this.getProp(PROP_COLLECTION), element, 1);
        return this;
    }
    remove(element) {
        const id = this.getProp(PROP_MODEL) && element instanceof this.getProp(PROP_MODEL) ? element.id : element;
        element = this.getProp(PROP_COLLECTION).get(id);
        let res = false;
        if (element) {
            res = this.getProp(PROP_COLLECTION).delete(id);
            element.off(dfiEventObject_1.default.events.ALL, this._onMemberAll, this);
            this.emit(DfiCollection.events.REMOVE, element, this.getProp(PROP_COLLECTION));
            this.emit(DfiCollection.events.UPDATE, this.getProp(PROP_COLLECTION), element, -1);
        }
        return res;
    }
    keys() {
        const keys = [];
        const iterator = this.getProp(PROP_COLLECTION).keys();
        for (const key of iterator) {
            keys.push(key);
        }
        return keys;
    }
    clear() {
        const collection = this.getProp(PROP_COLLECTION);
        collection.forEach((element) => {
            this.remove(element);
        });
        collection.clear();
        this.emit(DfiCollection.events.UPDATE, collection);
        return this;
    }
    forEach(fn, thisArg) {
        return this.getProp(PROP_COLLECTION).forEach(fn, thisArg);
    }
    toArray() {
        const entries = [];
        const iterator = this.getProp(PROP_COLLECTION).values();
        for (const value of iterator) {
            entries.push(value);
        }
        return entries;
    }
    proxyOn(event, fn, context) {
        const proxyCallbacks = this._proxyHandlers;
        if (!proxyCallbacks.has(event)) {
            proxyCallbacks.set(event, new Set());
        }
        const assigner = {
            c: fn,
            t: context
        };
        const handlers = proxyCallbacks.get(event);
        handlers.add(assigner);
        return this;
    }
    proxyOff(event, fn, context) {
        const handlers = this._proxyEventHandlers(event);
        if (handlers) {
            handlers.forEach((handler) => {
                if ((handler.c === fn && handler.t === context) || !fn) {
                    handlers.delete(handler);
                }
            });
            if (handlers.size === 0) {
                this._proxyHandlers.delete(event);
            }
        }
        return this;
    }
    proxyOffAll() {
        this._proxyHandlers.forEach((handlers, event) => {
            handlers.forEach((handler) => {
                this.proxyOff(event, handler.c, handler.t);
            });
        });
        return this;
    }
    _onMemberAll(event) {
        if (this._proxyHandlers.size > 0) {
            if (this._proxyHandlers.has(event)) {
                const args = Array.prototype.slice.call(arguments);
                args.shift();
                const handlers = this._proxyHandlers.get(event);
                handlers.forEach((handler) => {
                    handler.c.apply(handler.t, args);
                });
            }
            if (this._proxyHandlers.has(dfiEventObject_1.default.events.ALL)) {
                const args = Array.prototype.slice.call(arguments);
                const handlers = this._proxyHandlers.get(dfiEventObject_1.default.events.ALL);
                handlers.forEach((handler) => {
                    handler.c.apply(handler.t, args);
                });
            }
        }
    }
    _proxyEventHandlers(event) {
        return this._proxyHandlers.get(event);
    }
}
exports.DfiCollection = DfiCollection;
exports.default = DfiCollection;
const EVENTS = Object.assign({}, dfiEventObject_1.default.events, { ADD: Symbol(DfiCollection.prototype.constructor.name + ":add"), REMOVE: Symbol(DfiCollection.prototype.constructor.name + ":remove"), UPDATE: Symbol(DfiCollection.prototype.constructor.name + ":update") });
//# sourceMappingURL=dfiCollection.js.map