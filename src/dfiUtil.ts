import {IDfiCallbackResult} from "./dfiInterfaces";
import DebugLogger = require("local-dfi-debug-logger/debugLogger");


class DfiUtil {
    public static maybeCallbackOnce(fn: IDfiCallbackResult, context, err?, response?): void {
        if (typeof fn == "function") {
            if (fn.fired) {
                DfiUtil.logger.error("callback was fired before fn : \n%s", ((fn.prototype && fn.prototype.constructor) ? fn.prototype.constructor : fn.toString()));
                throw err ? err : response;
            } else {
                fn.fired = true;
                fn.call(context, err, response);
            }
        }
    }

    public static maybeCallback(fn: IDfiCallbackResult, context, err?, response?): void {
        if (typeof fn == "function") {
            fn.call(context, err, response);
        }
    }


    private static get logger() {
        return logger;
    }

    private static * _entries<V>(obj: {[key: string]: V}): Iterable<[ string, V]> {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                yield [key, obj[key]];
            }
        }
    }

    public static obj2map<V>(obj: {[key: string]: V}): Map<string, V> {
        return new Map(DfiUtil._entries< V>(obj))
    }
}
const logger = new DebugLogger("dfi:util");


export = DfiUtil;