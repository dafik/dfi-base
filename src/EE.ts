/**
 * Representation of a single EventEmitter function.
 *
 * @param {Function} fn Event handler to be called.
 * @param {*} context Context for function execution.
 * @param {Boolean} [once=false] Only emit once
 * @api private
 */
export default class EE {
    private fn;
    private context;
    private once;

    constructor(fn: (...args) => void, context?: any, once?: boolean) {
        this.fn = fn;
        this.context = context;
        this.once = once || false;
    }
}
