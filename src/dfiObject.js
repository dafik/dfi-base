"use strict";
const EE = require('eventemitter3');


/**
 * @type {WeakMap.<DfiObject,Map>}
 */
var privateProperties = new WeakMap();


/**
 * @typedef EventObject
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

    /**
     * @this EventObject
     */
    get options() {
        return privateProperties.get(this).get('options');
    }

    get(name) {
        return privateProperties.get(this).get(name);
    }

    set(name, value) {
        privateProperties.get(this).set(name, value);
        return this;
    }

    has(name) {
        return privateProperties.get(this).has(name);
    }


    initialize() {

    }

    on(name, callback, context) {
        var ret = super.on(name, callback, context);
        if (Array.isArray(this._events[name]) && this._events[name].length > 10) {
            this.logger.error(new Error('memory leak detected %j'))
        }
        return ret
    }

    emit(event) {

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


    destroy() {
        this.removeAllListeners();
        privateProperties.get(this._internalId).clear();
        privateProperties.delete(this._internalId);
    }

    static get events() {
        return Events;
    }
}
const Events = {
    ALL: Symbol(DfiObject.prototype.constructor.name + ':all')
};
module.exports = DfiObject;