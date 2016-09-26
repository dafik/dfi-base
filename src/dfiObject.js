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

    //noinspection ReservedWordAsName
    delete(key) {
        return privateProperties.get(this).delete(key);
    }


    initialize() {

    }


    on(name, callback, context) {

        if (name == undefined) {
            throw new Error('undefined event')
        } else if (typeof name != 'symbol') {
            this.logger.warn('on event not symbol "%s"', name)
        }
        if (!this._events) {
            this._events = {_length: 0, _names: []}
        }
        if (!this._events[name]) {
            this._events._length++;
            let label = name;
            if (typeof name == 'symbol') {
                label = Symbol.prototype.toString.call(name)
            }
            this._events._names.push(label);
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
        if (!this._events) {
            this._events = {_length: 0, _names: []}
        }
        if (!this._events[name]) {
            this._events._length++;
            this._events._names.push(Symbol.prototype.toString.call(name))
        }

        var ret = super.once(name, callback, context);

        if (Array.isArray(this._events[name]) && this._events[name].length > 10) {
            this.logger.error('memory leak detected: ')
        }
        return ret
    }


    emit(name) {

        if (name == undefined) {
            throw new Error('undefined event')
        } else if (typeof name != 'symbol') {
            this.logger.warn('emit event not symbol "%s"', name)
        }


        if (!this._events || (!this._events[name] && !this._events[Events.ALL])) return false;

        if (this._events[Events.ALL]) {
            if (this._events[name]) {
                super.emit.apply(this, arguments);
            }

            let len = arguments.length,
                args = new Array(len);
            args[0] = Events.ALL;
            for (let i = 0; i < len; i++) {
                args[i + 1] = arguments[i];
            }
            super.emit.apply(this, args);
        } else {
            super.emit.apply(this, arguments)
        }

        if (!this._events[name]) {
            if (this._events._length) {
                let eName = Symbol.prototype.toString.call(name);
                if (this._events._names) {
                    let index = this._events._names.indexOf(eName);
                    if (index !== -1) {
                        this._events._length--;
                        this._events._names.splice(index, 1)
                    }
                }
            }
        }
    }

    off(name) {
        if (name == undefined) {
            throw new Error('undefined event')
        } else if (typeof name != 'symbol') {
            this.logger.warn('off event not symbol "%s"', name)
        }

        if (typeof this._events[name] == "undefined") {
            return;
        }

        super.off.apply(this, arguments);
        if (!this._events[name]) {
            if (this._events._length) {
                let eName = Symbol.prototype.toString.call(name);
                if (this._events._names) {
                    let index = this._events._names.indexOf(eName);
                    if (index !== -1) {
                        this._events._length--;
                        this._events._names.splice(index, 1)
                    }
                }
            }
        }
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


    /**
     * @returns {{ALL,DESTROY}}
     */
    static get events() {
        return Events;
    }
}


let events = Object.create(null);

events['ALL'] = Symbol(DfiObject.prototype.constructor.name + ':all');
events['DESTROY'] = Symbol(DfiObject.prototype.constructor.name + ':destroy');
const Events = events;


module.exports = DfiObject;