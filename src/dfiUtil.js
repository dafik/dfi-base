"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const local_dfi_debug_logger_1 = require("local-dfi-debug-logger");
class DfiUtil {
    static maybeCallbackOnce(fn, context, err, response) {
        if (typeof fn === "function") {
            if (fn.fired) {
                DfiUtil.logger.error("callback was fired before fn : \n%s", ((fn.prototype && fn.prototype.constructor) ? fn.prototype.constructor : fn.toString()));
                throw err ? err : response;
            }
            else {
                fn.fired = true;
                fn.call(context, err, response);
            }
        }
    }
    static maybeCallback(fn, context, err, response) {
        if (typeof fn === "function") {
            fn.call(context, err, response);
        }
    }
    static obj2map(obj) {
        return new Map(DfiUtil._entries(obj));
    }
    static cloneLiteral(literal) {
        return JSON.parse(JSON.stringify(literal));
    }
    static formatError(err) {
        if (err instanceof Error) {
            if (err.description && err.description instanceof Error) {
                return [
                    ...["Error: " + err.message],
                    ...DfiUtil.formatError(err.description)
                ];
            }
            else {
                return ["Error: " + err.message];
            }
        }
    }
    static get logger() {
        return logger;
    }
    static *_entries(obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                yield [key, obj[key]];
            }
        }
    }
}
exports.DfiUtil = DfiUtil;
const logger = new local_dfi_debug_logger_1.default("dfi:util");
exports.default = DfiUtil;
//# sourceMappingURL=dfiUtil.js.map