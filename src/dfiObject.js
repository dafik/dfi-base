"use strict";
const EE = require('eventemitter3');


/**
 * @type {WeakMap.<DfiObject,Map>}
 */
var privateProperties = new WeakMap();


/**
 * @typedef DfiObject
 * @extends EventEmitter
 *
 */
class DfiObject extends EE {
    constructor(options) {
        super();

        privateProperties.set(this, new Map());

        if (options) {
            this.set('options', options);
        }
    }

    get options() {
        return privateProperties.get(this).get('options');
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


    initialize() {

    }

    on(name, callback, context) {

        if (name == undefined) {
            throw new Error('undefined event')
        } else if (typeof name != 'symbol') {
            this.logger.warn('one event not symbol "%s"', name)
        }

        var ret = super.on(name, callback, context);

        if (Array.isArray(this._events[name]) && this._events[name].length > 10) {
            this.logger.error('memory leak detected: ')
        }
        return ret
    }


    once(name, callback, context) {

        if (name == undefined) {
            throw new Error('undefined event')
        } else if (typeof name != 'symbol') {
            this.logger.warn('once event not symbol "%s"', name)
        }

        var ret = super.once(name, callback, context);

        if (Array.isArray(this._events[name]) && this._events[name].length > 10) {
            this.logger.error('memory leak detected: ')
        }
        return ret
    }


    emit(event) {

        if (event == undefined) {
            throw new Error('undefined event')
        } else if (typeof event != 'symbol') {
            this.logger.warn('emit event not symbol "%s"', event)
        }


        if (!this._events || (!this._events[event] && !this._events[Events.ALL])) return false;

        if (this._events[Events.ALL]) {
            super.emit.apply(this, arguments);

            let len = arguments.length,
                args = new Array(len);
            args[0] = Events.ALL;
            for (let i = 0; i < len; i++) {
                args[i + 1] = arguments[i];
            }
            return super.emit.apply(this, args);
        } else {
            return super.emit.apply(this, arguments)
        }
    }

    get evtObj() {

        let val, ret = Object.create(null);
        for (let ev in this._events) {
            val = this._events[ev];
            if (typeof ev == "symbol") {
                ev = ev.toString();
            }
            ret[ev] = val
        }
        return val;

    }

    destroy(callback) {
        this.removeAllListeners();

        privateProperties.get(this).clear();
        privateProperties.delete(this);

        if (typeof callback == "function") {
            callback();
        }
    }

    __getProp() {
        return privateProperties.get(this);
    }


    /**
     * @returns {{ALL: Symbol}}
     */
    static get events() {
        return Events;
    }
}


let events = Object.create(null);

events['ALL'] = Symbol(DfiObject.prototype.constructor.name + ':all');
const Events = events;


module.exports = DfiObject;