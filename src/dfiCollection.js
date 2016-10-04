"use strict";
const DfiEventObject = require("./dfiEventObject");
class DfiCollection extends DfiEventObject {
    constructor(options) {
        options = options || {};
        if (!options.loggerName) {
            options.loggerName = 'dfi:collection:';
        }
        super(options);
        this.setProp('collection', new Map());
        this.setProp('proxyCallbacks', new Map());
        if (options.idField) {
            this.setProp('idField', options.idField);
        }
        if (options.model) {
            this.setProp('model', options.model);
        }
    }
    has(element) {
        let id = (this.getProp('model') && element instanceof this.getProp('model')) ? element.id : element;
        return this.getProp('collection').has(id);
    }
    get(id) {
        return this.getProp('collection').get(id);
    }
    add(element) {
        let res = this.getProp('collection').set(element.id, element);
        element.on(DfiEventObject.events.ALL, this._onMemberAll, this);
        this.emit(DfiCollection.events.ADD, element, this.getProp('collection'));
        this.emit(DfiCollection.events.UPDATE, this.getProp('collection'), element, 1);
        return res;
    }
    remove(element) {
        let id = element instanceof this.getProp('model') ? element.id : element;
        element = this.getProp('collection').get(id);
        let res = false;
        if (element) {
            res = this.getProp('collection').delete(id);
            element.on(DfiEventObject.events.ALL, this._onMemberAll, this);
            this.emit(DfiCollection.events.REMOVE, element, this.getProp('collection'));
            this.emit(DfiCollection.events.UPDATE, this.getProp('collection'), element, -1);
        }
        return res;
    }
    keys() {
        var keys = [];
        var iterator = this.getProp('collection').keys();
        for (let key of iterator) {
            keys.push(key);
        }
        return keys;
    }
    clear() {
        this.getProp('collection').clear();
        this.emit(DfiCollection.events.UPDATE, this.getProp('collection'), null, 0);
        return this;
    }
    forEach(Fn, thisArg) {
        return this.getProp('collection').forEach(Fn, thisArg);
    }
    toArray() {
        var entries = [];
        var iterator = this.getProp('collection').values();
        for (let value of iterator) {
            entries.push(value);
        }
        return entries;
    }
    toJSON() {
        let out = {
            size: this.getProp('collection').size,
            entries: Object.create(null)
        };
        this.getProp('collection').forEach((value, key) => {
            out['entries'][key] = value;
        });
        return out;
    }
    get size() {
        return this.getProp('collection').size;
    }
    destroy() {
        this.removeAllListeners();
        this.getProp('collection').clear();
        this.proxyOffAll();
        super.destroy();
    }
    _onMemberAll(event) {
        if (this.getProp('proxyCallbacks').size > 0) {
            if (this.getProp('proxyCallbacks').has(event)) {
                let args = Array.prototype.slice.call(arguments);
                args.shift();
                let handlers = this.getProp('proxyCallbacks').get(event);
                handlers.forEach((handler) => {
                    handler.f.apply(handler.t, args);
                });
            }
            else if (this.getProp('proxyCallbacks').has(DfiEventObject.events.ALL)) {
                let args = Array.prototype.slice.call(arguments);
                let handlers = this.getProp('proxyCallbacks').get(DfiEventObject.events.ALL);
                handlers.forEach((handler) => {
                    handler.c.apply(handler.t, args);
                });
            }
        }
    }
    proxyOn(event, fn, context) {
        let proxyCallbacks = this.getProp('proxyCallbacks');
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
        let handlers = this.getProp('proxyCallbacks').get(event);
        if (handlers) {
            handlers.forEach((handler) => {
                if ((handler.c == fn && handler.t == context) || !fn) {
                    handlers.delete(handler);
                }
            });
            if (handlers.size == 0) {
                this.getProp('proxyCallbacks').delete(event);
            }
        }
    }
    proxyOffAll() {
        this.getProp('proxyCallbacks').forEach((handlers, event) => {
            handlers.forEach((handler) => {
                this.proxyOff(event, handler.c, handler.t);
            });
        });
    }
    static get events() {
        return Events;
    }
}
const Events = Object.assign(Object.assign({}, DfiEventObject.events), {
    ADD: Symbol(DfiCollection.prototype.constructor.name + ':add'),
    REMOVE: Symbol(DfiCollection.prototype.constructor.name + ':delete'),
    UPDATE: Symbol(DfiCollection.prototype.constructor.name + ':update')
});
module.exports = DfiCollection;
//# sourceMappingURL=dfiCollection.js.map