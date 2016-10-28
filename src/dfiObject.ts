import {IDfiBaseObjectConfig} from "./dfiInterfaces";
import DebugLogger = require("local-dfi-debug-logger");

let privateProperties: WeakMap<DfiObject, Map<any, any>> = new WeakMap();

const PROP_LOGGER = "logger";

abstract class DfiObject {
    public destroyed?: boolean;

    public get logger(): DebugLogger {
        return privateProperties.get(this).get(PROP_LOGGER);
    }

    constructor(options?: IDfiBaseObjectConfig) {

        privateProperties.set(this, new Map());
        options = options || {};

        this.setProp("logger", new DebugLogger((options.loggerName ? options.loggerName : "dfi:object:") + this.constructor.name));

        for (let property in options) {
            if (options.hasOwnProperty(property)) {
                if (property !== "loggerName") {
                    this.setProp(property, options[property]);
                }
            }
        }
    }

    public destroy() {
        privateProperties.get(this).clear();
        privateProperties.delete(this);

        this.destroyed = true;
    }

    public toPlain(): Object {
        let prop = {};
        let p = privateProperties.get(this);
        if (p) {
            p.forEach((value, name) => {
                if (name !== "attributes") {
                    prop[name] = value;
                }
            });
        }
        return prop;
    }

    protected getProp(key: any): any {
        return privateProperties.get(this).get(key);
    }

    protected setProp(key: any, value: any): DfiObject {
        privateProperties.get(this).set(key, value);
        return this;
    }

    protected hasProp(key): boolean {
        return privateProperties.get(this).has(key);
    }

    protected removeProp(key): boolean {
        return privateProperties.get(this).delete(key);
    }

}

export = DfiObject;
