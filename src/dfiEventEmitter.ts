import {TEventName} from "./dfiInterfaces";
import EE from "./EE";
import {NullProto} from "./NullProto";

const has = Object.prototype.hasOwnProperty;

/**
 * Minimal EventEmitter interface that is molded against the Node.js
 * EventEmitter interface.
 */
export class EventEmitter {

    private _events: NullProto;

    /**
     * Return an array listing the events for which the emitter has registered
     * listeners.
     */
    public eventNames(exists?: boolean): TEventName[] {
        const events = this._events;
        const names = [];
        let symbols = [];
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
            symbols = Object.getOwnPropertySymbols(events);
            if (!exists) {
                symbols.forEach((elem, index) => {
                    symbols[index] = Symbol.prototype.toString.call(elem);
                });
            }
        }
        return names.concat(symbols);
    }

    /**
     * Return a list of assigned event listeners.
     *
     * @param {String | Symbol} event The events that should be listed.
     * @param {Boolean} exists We only need to know if there are listeners.
     * @returns {Array|Boolean}
     */
    public listeners(event?: TEventName, exists?: boolean): Array<(...args) => void>/* Array<EE>*/ | boolean {
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
    public emit(event: TEventName, a1?: any, a2?: any, a3?: any, a4?: any, a5?: any, ...args: any[]): boolean {
        if (!this._events || !this._events[event]) {
            return false;
        }

        const listeners = this._events[event];
        const listenersFns = this.listeners(event);
        const len = arguments.length;
        let args1;
        let i;

        if ((listenersFns as Array<(...args) => void> ).length === 1) {
            const listenersFn = (listenersFns as Array<(...args) => void> ).pop();
            if (listeners.once) {
                this.removeListener(event, listenersFn, undefined, true);
            }

            switch (len) {
                case 1:
                    // noinspection CommaExpressionJS
                    return listenersFn.call(listeners.context), true;
                case 2:
                    // noinspection CommaExpressionJS
                    return listenersFn.call(listeners.context, a1), true;
                case 3:
                    // noinspection CommaExpressionJS
                    return listenersFn.call(listeners.context, a1, a2), true;
                case 4:
                    // noinspection CommaExpressionJS
                    return listenersFn.call(listeners.context, a1, a2, a3), true;
                case 5:
                    // noinspection CommaExpressionJS
                    return listenersFn.call(listeners.context, a1, a2, a3, a4), true;
                case 6:
                    // noinspection CommaExpressionJS
                    return listenersFn.call(listeners.context, a1, a2, a3, a4, a5), true;
                default:
                    for (i = 1, args1 = new Array(len - 1); i < len; i++) {
                        args1[i - 1] = arguments[i];
                    }

                    listeners.fn.apply(listeners.context, args1);
            }
        } else {
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
    public on(event: TEventName, fn: (...args) => void, context?: any): this {
        const listener = new EE(fn, context);

        if (!this._events) {
            this._events = Object.create(null);
        }
        if (!this._events[event]) {
            this._events[event] = listener;
        } else {
            if (!this._events[event].fn) {
                this._events[event].push(listener);
            } else {
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
    public once(event: TEventName, fn: (...args) => void, context?: any): EventEmitter {
        const listener = new EE(fn, context, true);
        if (!this._events) {
            this._events = Object.create(null);
        }
        if (!this._events[event]) {
            this._events[event] = listener;
        } else {
            if (!this._events[event].fn) {
                this._events[event].push(listener);
            } else {
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
    public removeListener(event: TEventName, fn?: (...args) => void, context?: any, once?: boolean) {
        if (!this._events || !this._events[event]) {
            return this;
        }

        let listeners = this._events[event];
        once = once || false;
        const events = [];

        if (!Array.isArray(listeners)) {
            listeners = [listeners];
        }
        (listeners as any[] ).forEach((listener) => {
            if (fn) {
                if (listener.fn) {
                    if (!(listener.fn === fn && once === listener.once && listener.context === context)) {
                        events.push(listener);
                    }
                } else {
                    if (!(listener.fn === fn && once === listener.once && listener.context === context)) {
                        events.push(listener);
                    }
                }
            }
        });

        //
        // Reset the array, or remove it completely if we have no more listeners.
        //
        if (events.length) {
            this._events[event] = events.length === 1 ? events[0] : events;
        } else {
            delete this._events[event];
        }

        return this;
    }

    /**
     * Remove all listeners or only the listeners for the specified event.
     *
     * @param  event The event want to remove all listeners for.
     */
    public removeAllListeners(event?: TEventName): this {
        if (!this._events) {
            return this;
        }

        if (event) {
            delete this._events[event];
        } else {
            this._events = Object.create(null);
        }

        return this;
    }
}

export default EventEmitter;
