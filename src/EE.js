"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Representation of a single EventEmitter function.
 *
 * @param {Function} fn Event handler to be called.
 * @param {*} context Context for function execution.
 * @param {Boolean} [once=false] Only emit once
 * @api private
 */
class EE {
    constructor(fn, context, once) {
        this.fn = fn;
        this.context = context;
        this.once = once || false;
    }
}
exports.default = EE;
//# sourceMappingURL=EE.js.map