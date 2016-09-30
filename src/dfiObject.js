"use strict";
const DebugLogger = require("local-dfi-debug-logger/debugLogger");
const EventEmitter = require("./dfiEventEmitter");
var privateProperties = new WeakMap();
class DfiObject {
    constructor(options) {
        privateProperties.set(this, new Map());
        options = options || {};
        this.setProp('logger', new DebugLogger((options.loggerName ? options.loggerName : 'dfi:object:') + this.constructor.name));
        this.setProp('emitter', new EventEmitter());
        for (let property in options) {
            if (property != 'loggerName') {
                this.setProp(property, options[property]);
            }
        }
    }
    get options() {
        return privateProperties.get(this).get('options');
    }
    get logger() {
        return privateProperties.get(this).get('logger');
    }
    getProp(key) {
        return privateProperties.get(this).get(key);
    }
    setProp(key, value) {
        privateProperties.get(this).set(key, value);
        return this;
    }
    hasProp(key) {
        return privateProperties.get(this).has(key);
    }
    removeProp(key) {
        return privateProperties.get(this).delete(key);
    }
    get _ee() {
        return this.getProp('emitter');
    }
    on(event, fn, context) {
        if (event == undefined) {
            throw new Error('undefined event');
        }
        else if (typeof event != 'symbol') {
            this.logger.warn('on event not symbol "%s"', event);
        }
        var ret = this._ee.on(event, fn, context);
        if (this._ee.eventNames(true).length > 10) {
            this.logger.error('memory leak detected: ');
        }
        return ret;
    }
    get eventNames() {
        return this._ee.eventNames();
    }
    once(event, fn, context) {
        if (event == undefined) {
            throw new Error('undefined event');
        }
        else if (typeof event != 'symbol') {
            this.logger.warn('once event not symbol "%s"', event);
        }
        var ret = this._ee.once(event, fn, context);
        if (this._ee.eventNames().length > 10) {
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
        if (!this._ee.listeners(event, true) && !this._ee.listeners(DfiObject.events.ALL, true))
            return false;
        if (this._ee.listeners(DfiObject.events.ALL, true)) {
            if (this._ee.listeners(event, true)) {
                this._ee.emit.apply(this._ee, arguments);
            }
            let args = Array.prototype.slice.call(arguments);
            args.unshift(Events.ALL);
            ret = this._ee.emit.apply(this._ee, args);
        }
        else {
            ret = this._ee.emit.apply(this._ee, arguments);
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
        if (!this._ee.eventNames(true)) {
            return;
        }
        return this._ee.removeListener(event, fn, context, once);
    }
    removeAllListeners(event) {
        return this._ee.removeAllListeners(event);
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
    toPlain() {
        let prop = {};
        let p = this.__getProp();
        if (p) {
            p.forEach((value, name) => {
                if (name !== 'attributes') {
                    prop[name] = value;
                }
            });
        }
        return prop;
    }
    static get events() {
        return Events;
    }
}
const Events = Object.assign({}, {
    ALL: Symbol(DfiObject.prototype.constructor.name + ':all'),
    DESTROY: Symbol(DfiObject.prototype.constructor.name + ':destroy')
});
module.exports = DfiObject;
//# sourceMappingURL=dfiObject.js.map