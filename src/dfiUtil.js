"use strict";
const DebugLogger = require("local-dfi-debug-logger/debugLogger");
class DfiUtil {
    static maybeCallbackOnce(fn, context, err, response) {
        if (typeof fn == "function") {
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
        if (typeof fn == "function") {
            fn.call(context, err, response);
        }
    }
    static get logger() {
        return logger;
    }
    static *_entries(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                yield [key, obj[key]];
            }
        }
    }
    static obj2map(obj) {
        return new Map(DfiUtil._entries(obj));
    }
}
const logger = new DebugLogger("dfi:util");
module.exports = DfiUtil;
//# sourceMappingURL=dfiUtil.js.map