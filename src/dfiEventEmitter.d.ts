/**
 * Minimal EventEmitter interface that is molded against the Node.js
 * EventEmitter interface.
 */
declare class EventEmitter {
    private _events;
    /**
     * Return an array listing the events for which the emitter has registered
     * listeners.
     */
    eventNames(exists?: boolean): Array<string | symbol>;
    /**
     * Return a list of assigned event listeners.
     *
     * @param {String | Symbol} event The events that should be listed.
     * @param {Boolean} exists We only need to know if there are listeners.
     * @returns {Array|Boolean}
     */
    listeners(event?: symbol | string, exists?: boolean): Function[] | boolean;
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
    emit(event: symbol | string, a1: any, a2: any, a3: any, a4: any, a5: any, ...args: any[]): boolean;
    /**
     * Register a new EventListener for the given event.
     *
     * @param {String} event Name of the event.
     * @param {Function} fn Callback function.
     * @param {*} [context=this] The context of the function.
     * @api public
     */
    on(event: symbol | string, fn: Function, context?: any): this;
    /**
     * Add an EventListener that's only called once.
     *
     * @param {String} event Name of the event.
     * @param {Function} fn Callback function.
     * @param {*} [context=this] The context of the function.
     * @api public
     */
    once(event: symbol | string, fn: Function, context?: any): EventEmitter;
    /**
     * Remove event listeners.
     *
     * @param {String} event The event we want to remove.
     * @param {Function} fn The listener that we need to find.
     * @param {*} context Only remove listeners matching this context.
     * @param {Boolean} once Only remove once listeners.
     * @api public
     */
    removeListener(event: symbol | string, fn?: Function, context?: any, once?: boolean): this;
    /**
     * Remove all listeners or only the listeners for the specified event.
     *
     * @param  event The event want to remove all listeners for.
     */
    removeAllListeners(event?: symbol | string): this;
}
export = EventEmitter;
