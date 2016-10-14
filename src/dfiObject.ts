import DebugLogger = require("local-dfi-debug-logger/debugLogger");
import {IDfiBaseObjectConfig} from "./dfiInterfaces";

const privateProperties: WeakMap<DfiObject, Map<any, any>> = new WeakMap();

abstract class DfiObject {
    public destroyed?: boolean;

    constructor(options?: IDfiBaseObjectConfig) {

        privateProperties.set(this, new Map());
        options = options || {};

        this.setProp("logger", new DebugLogger((options.loggerName ? options.loggerName : "dfi:object:") + this.constructor.name));

        for (let property in options) {
            if (property !== "loggerName") {
                this.setProp(property, options[property]);
            }
        }
    }

    get options(): IDfiBaseObjectConfig {
        return privateProperties.get(this).get("options");
    }

    get logger(): DebugLogger {
        return privateProperties.get(this).get("logger");
    }

    public toPlain(): Object {
        let prop = {};
        let p = this.__getProp();
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

    protected destroy() {
        privateProperties.get(this).clear();
        privateProperties.delete(this);

        this.destroyed = true;
    }

    protected __getProp() {
        return privateProperties.get(this);
    }
}

export = DfiObject;
