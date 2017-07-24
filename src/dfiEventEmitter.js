"use strict";
const EE_1 = require("./EE");
const has = Object.prototype.hasOwnProperty;
/**
 * Minimal EventEmitter interface that is molded against the Node.js
 * EventEmitter interface.
 */
class EventEmitter {
    /**
     * Return an array listing the events for which the emitter has registered
     * listeners.
     */
    eventNames(exists) {
        const events = this._events;
        const names = [];
        let name;
        if (!events) {
            return names;
        }
        for (name in events) {
            if (has.call(events, name)) {
                names.push(name);
            }
        }
        if (Object.getOwnPropertySymbols) {
            const symbols = Object.getOwnPropertySymbols(events);
            if (!exists) {
                symbols.forEach((elem, index) => {
                    symbols[index] = Symbol.prototype.toString.call(elem);
                });
            }
            return names.concat(symbols);
        }
        return names;
    }
    /**
     * Return a list of assigned event listeners.
     *
     * @param {String | Symbol} event The events that should be listed.
     * @param {Boolean} exists We only need to know if there are listeners.
     * @returns {Array|Boolean}
     */
    listeners(event, exists) {
        const available = this._events && this._events[event];
        if (exists) {
            return !!available;
        }
        if (!available) {
            return [];
        }
        if (available.fn) {
            return [available.fn];
        }
        const l = available.length;
        const ee = new Array(l);
        let i = 0;
        for (i; i < l; i++) {
            ee[i] = available[i].fn;
        }
        return ee;
    }
    /**
     * Emit an event to all registered event listeners.
     *
     * @param {String} event The name of the event.
     * @param a1 :a
     * @param a2
     * @param a3
     * @param a4
     * @param a5
     * @param args
     * @returns {Boolean} Indication if we've emitted an event.
     * @api public
     */
    emit(event, a1, a2, a3, a4, a5, ...args) {
        if (!this._events || !this._events[event]) {
            return false;
        }
        const listeners = this._events[event];
        const len = arguments.length;
        let args1;
        let i;
        if ("function" === typeof listeners.fn) {
            if (listeners.once) {
                this.removeListener(event, listeners.fn, undefined, true);
            }
            switch (len) {
                case 1:
                    return listeners.fn.call(listeners.context), true;
                case 2:
                    return listeners.fn.call(listeners.context, a1), true;
                case 3:
                    return listeners.fn.call(listeners.context, a1, a2), true;
                case 4:
                    return listeners.fn.call(listeners.context, a1, a2, a3), true;
                case 5:
                    return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
                case 6:
                    return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
                default:
                    for (i = 1, args1 = new Array(len - 1); i < len; i++) {
                        args1[i - 1] = arguments[i];
                    }
                    listeners.fn.apply(listeners.context, args1);
            }
        }
        else {
            const length = listeners.length;
            let j;
            for (i = 0; i < length; i++) {
                if (listeners[i].once) {
                    this.removeListener(event, listeners[i].fn, undefined, true);
                }
                switch (len) {
                    case 1:
                        listeners[i].fn.call(listeners[i].context);
                        break;
                    case 2:
                        listeners[i].fn.call(listeners[i].context, a1);
                        break;
                    case 3:
                        listeners[i].fn.call(listeners[i].context, a1, a2);
                        break;
                    default:
                        if (!args1) {
                            for (j = 1, args1 = new Array(len - 1); j < len; j++) {
                                args1[j - 1] = arguments[j];
                            }
                        }
                        listeners[i].fn.apply(listeners[i].context, args1);
                }
            }
        }
        return true;
    }
    /**
     * Register a new EventListener for the given event.
     *
     * @param {String} event Name of the event.
     * @param {Function} fn Callback function.
     * @param {*} [context=this] The context of the function.
     * @api public
     */
    on(event, fn, context) {
        const listener = new EE_1.default(fn, context || this);
        if (!this._events) {
            this._events = Object.create(null);
        }
        if (!this._events[event]) {
            this._events[event] = listener;
        }
        else {
            if (!this._events[event].fn) {
                this._events[event].push(listener);
            }
            else {
                this._events[event] = [this._events[event], listener];
            }
        }
        return this;
    }
    /**
     * Add an EventListener that's only called once.
     *
     * @param {String} event Name of the event.
     * @param {Function} fn Callback function.
     * @param {*} [context=this] The context of the function.
     * @api public
     */
    once(event, fn, context) {
        const listener = new EE_1.default(fn, context || this, true);
        if (!this._events) {
            this._events = Object.create(null);
        }
        if (!this._events[event]) {
            this._events[event] = listener;
        }
        else {
            if (!this._events[event].fn) {
                this._events[event].push(listener);
            }
            else {
                this._events[event] = [
                    this._events[event], listener
                ];
            }
        }
        return this;
    }
    /**
     * Remove event listeners.
     *
     * @param {String} event The event we want to remove.
     * @param {Function} fn The listener that we need to find.
     * @param {*} context Only remove listeners matching this context.
     * @param {Boolean} once Only remove once listeners.
     * @api public
     */
    removeListener(event, fn, context, once) {
        if (!this._events || !this._events[event]) {
            return this;
        }
        const listeners = this._events[event];
        const events = [];
        if (fn) {
            if (listeners.fn) {
                if (listeners.fn !== fn
                    || (once && !listeners.once)
                    || (context && listeners.context !== context)) {
                    events.push(listeners);
                }
            }
            else {
                for (let i = 0, length = listeners.length; i < length; i++) {
                    if (listeners[i].fn !== fn
                        || (once && !listeners[i].once)
                        || (context && listeners[i].context !== context)) {
                        events.push(listeners[i]);
                    }
                }
            }
        }
        //
        // Reset the array, or remove it completely if we have no more listeners.
        //
        if (events.length) {
            this._events[event] = events.length === 1 ? events[0] : events;
        }
        else {
            delete this._events[event];
        }
        return this;
    }
    /**
     * Remove all listeners or only the listeners for the specified event.
     *
     * @param  event The event want to remove all listeners for.
     */
    removeAllListeners(event) {
        if (!this._events) {
            return this;
        }
        if (event) {
            delete this._events[event];
        }
        else {
            this._events = Object.create(null);
        }
        return this;
    }
}
module.exports = EventEmitter;
//# sourceMappingURL=dfiEventEmitter.js.map