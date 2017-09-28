import DebugLogger from "local-dfi-debug-logger";
import {IDfiCallbackResult} from "./dfiInterfaces";

export class DfiUtil {
    public static maybeCallbackOnce(fn: IDfiCallbackResult, context, err?, response?): void {
        if (typeof fn === "function") {
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
        if (typeof fn === "function") {
            fn.call(context, err, response);
        }
    }

    public static obj2map<V>(obj: { [key: string]: V }): Map<string, V> {
        return new Map(DfiUtil._entries<V>(obj));
    }

    public static cloneLiteral(literal: {}) {
        return JSON.parse(JSON.stringify(literal));
    }

    public static formatError(err?: IErrorDescription) {
        if (err instanceof Error) {
            if (err.description && err.description instanceof Error) {
                return [
                    ...["Error: " + err.message],
                    ...DfiUtil.formatError(err.description)
                ];
            } else {
                return ["Error: " + err.message];
            }
        }
    }

    private static get logger() {
        return logger;
    }

    private static * _entries<V>(obj: { [key: string]: V }): Iterable<[string, V]> {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                yield [key, obj[key]];
            }
        }
    }
}

interface IErrorDescription extends Error {
    description?: Error;
}


const logger = new DebugLogger("dfi:util");

export default DfiUtil;
