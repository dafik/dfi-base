"use strict";
const EventEmitter = require("eventemitter3");
const local_dfi_debug_logger_1 = require("local-dfi-debug-logger");
var privateProperties = new WeakMap();
class DfiObject extends EventEmitter {
    constructor(options) {
        super();
        privateProperties.set(this, new Map());
        if (options) {
            this.set('options', options);
        }
        this.set('logger', new local_dfi_debug_logger_1.default((options.loggerName ? options.loggerName : 'dfi:collection:') + this.constructor.name));
    }
    get options() {
        return privateProperties.get(this).get('options');
    }
    get logger() {
        return privateProperties.get(this).get('logger');
    }
    get(key) {
        return privateProperties.get(this).get(key);
    }
    set(key, value) {
        privateProperties.get(this).set(key, value);
        return this;
    }
    has(key) {
        return privateProperties.get(this).has(key);
    }
    delete(key) {
        return privateProperties.get(this).delete(key);
    }
    on(event, fn, context) {
        if (event == undefined) {
            throw new Error('undefined event');
        }
        else if (typeof event != 'symbol') {
            this.logger.warn('on event not symbol "%s"', event);
        }
        if (!this._events) {
            this._events = { _length: 0, _names: [] };
        }
        if (!this._events[event]) {
            this._events._length++;
            let label = typeof event == 'symbol' ? Symbol.prototype.toString.call(event) : event;
            this._events._names.push(label);
        }
        var ret = super.on(event, fn, context);
        if (Array.isArray(this._events[event]) && this._events[event].length > 10) {
            this.logger.error('memory leak detected: ');
        }
        return ret;
    }
    once(event, fn, context) {
        if (event == undefined) {
            throw new Error('undefined event');
        }
        else if (typeof event != 'symbol') {
            this.logger.warn('once event not symbol "%s"', event);
        }
        if (!this._events) {
            this._events = { _length: 0, _names: [] };
        }
        if (!this._events[event]) {
            this._events._length++;
            this._events._names.push(Symbol.prototype.toString.call(event));
        }
        var ret = super.once(event, fn, context);
        if (Array.isArray(this._events[event]) && this._events[event].length > 10) {
            this.logger.error('memory leak detected: ');
        }
        return ret;
    }
    emit(event, ...args) {
        let ret;
        if (event == undefined) {
            throw new Error('undefined event');
        }
        else if (typeof event != 'symbol') {
            this.logger.warn('emit event not symbol "%s"', event);
        }
        if (!this._events || (!this._events[event] && !this._events[Events.ALL]))
            return false;
        if (this._events[Events.ALL]) {
            if (this._events[event]) {
                ret = super.emit.apply(this, arguments);
            }
            let args = Array.prototype.slice.call(arguments);
            args.unshift(Events.ALL);
            ret = super.emit.apply(this, args);
        }
        else {
            ret = super.emit.apply(this, arguments);
        }
        if (!this._events[event]) {
            if (this._events._length) {
                let eName = Symbol.prototype.toString.call(event);
                if (this._events._names) {
                    let index = this._events._names.indexOf(eName);
                    if (index !== -1) {
                        this._events._length--;
                        this._events._names.splice(index, 1);
                    }
                }
            }
        }
        return ret;
    }
    off(event, fn, context, once) {
        if (event == undefined) {
            throw new Error('undefined event');
        }
        else if (typeof event != 'symbol') {
            this.logger.warn('off event not symbol "%s"', event);
        }
        if (!this._events[event]) {
            return;
        }
        let ret = super.off(event, fn, context, once);
        if (!this._events[event]) {
            if (this._events._length) {
                let eName;
                if (typeof event == "symbol") {
                    eName = Symbol.prototype.toString.call(event);
                }
                else {
                    eName = event;
                }
                if (this._events._names) {
                    let index = this._events._names.indexOf(eName);
                    if (index !== -1) {
                        this._events._length--;
                        this._events._names.splice(index, 1);
                    }
                }
            }
        }
        return ret;
    }
    destroy() {
        this.emit(DfiObject.events.DESTROY);
        this.removeAllListeners();
        privateProperties.get(this).clear();
        privateProperties.delete(this);
        this.destroyed = true;
    }
    __getProp() {
        return privateProperties.get(this);
    }
    static get events() {
        return Events;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DfiObject;
const Events = Object.assign(Object.assign({}, DfiObject.events), {
    ALL: Symbol(DfiObject.prototype.constructor.name + ':all'),
    DESTROY: Symbol(DfiObject.prototype.constructor.name + ':destroy')
});
//# sourceMappingURL=dfiObject.js.map