import {IDfiBaseModelAttribs, IDfiBaseModelConfig, IDfiBaseModelEvents} from "./dfiInterfaces";
import DfiEventObject = require("./dfiEventObject");

const MODEL_UNIQUE_ID = (() => {
    let nextId = 1;
    return () => {
        return nextId++;
    };
})();

abstract class DfiModel extends DfiEventObject {

    protected static map: Map<string, string>;

    /**
     * @param attributes
     * @param options
     * @param notMakeStamp
     */
    constructor(attributes?: IDfiBaseModelAttribs, options?: IDfiBaseModelConfig, notMakeStamp?: boolean) {
        options = options || {};
        if (!options.loggerName) {
            options.loggerName = "dfi:model:";
        }

        super(options);

        this.setProp("attributes", new Map());

        this._getAttributeMap(attributes).forEach((target, source) => {
            if (attributes.hasOwnProperty(source)) {
                this.set(target, attributes[source], true);
            }
        });

        if (this.hasProp("idAttribute") && this.has(this.getProp("idAttribute"))) {
            this.setProp("id", this.get(this.getProp("idAttribute")));
        } else if (this.has("id")) {
            this.setProp("id", this.get("id"));
        } else if (Object.hasOwnProperty.call(attributes, "id")) {
            this.setProp("id", attributes.id);
        } else {
            this.setProp("id", options.loggerName + MODEL_UNIQUE_ID());
        }

        if (!notMakeStamp) {
            this.stampLastUpdate();
        }
    }

    get id(): any {
        return this.getProp("id");
    }

    get lastUpdate(): number {
        return this.getProp("lastUpdate");
    }

    public stampLastUpdate(time?: number): void {
        if (time) {
            this.setProp("lastUpdate", time);
        } else {
            this.setProp("lastUpdate", Date.now());
        }
    }

    public toJSON(): Object {
        let attr = {id: this.id};
        this.getProp("attributes").forEach((value, name) => {
            attr[name] = value;
        });
        return attr;
    }

    public toPlain(): Object {
        let attr = {};
        this.getProp("attributes").forEach((value, name) => {
            attr[name] = value;
        });

        let prop = {};
        this.__getProp().forEach((value, name) => {
            if (name !== "attributes") {
                prop[name] = value;
            }

        });
        return {attr, prop};
    }

    public destroy() {
        this.getProp("attributes").clear();
        super.destroy();
        this.destroyed = true;
    }

    protected get(attribute: string): any {
        if (this.getProp("attributes")) {
            if (this.getProp("attributes").has(attribute)) {
                return this.getProp("attributes").get(attribute);
            }
        }
        return undefined;
    }

    protected has(attribute: string): boolean {
        return this.getProp("attributes").has(attribute);
    }

    protected set(attribute: string | Object, value: any, silent?: boolean): this {
        if (typeof attribute === "object") {
            silent = value;
            for (let attr in attribute) {
                if (attribute.hasOwnProperty(attr)) {
                    this.set(attr, attribute[attr], silent);
                }
            }
            return this;
        }

        let old = this.get(attribute);
        if (old === value) {
            return;
        }

        this.getProp("attributes").set(attribute, value);
        this.stampLastUpdate();
        if (silent !== true) {
            if (old === undefined) {
                this.emit(EVENTS.ADD, this, attribute, value);
            }
            this.emit(EVENTS.UPDATE, this, attribute, value, old);
        }
        return this;

    }

    protected remove(attribute) {
        let value = this.getProp("attributes").get(attribute);
        let ret = this.getProp("attributes").delete(attribute);

        this.emit(EVENTS.REMOVE, this, attribute, value);
        this.emit(EVENTS.UPDATE, this, attribute, value);
        return ret;
    }

    public static get events(): IDfiBaseModelEvents {
        return EVENTS;
    }

    private _getAttributeMap(attributes: Object): Map<string, string> {
        if ((this.constructor as typeof DfiModel).map) {
            return (this.constructor as typeof DfiModel).map;
        } else {
            let result = new Map();
            let keys = Object.keys(attributes);
            for (let i = 0, length = keys.length; i < length; i++) {
                result.set(keys[i], keys[i]);
            }
            return result;
        }
    }
}

export =  DfiModel;

const EVENTS: IDfiBaseModelEvents = Object.assign(
    Object.assign({}, DfiEventObject.events),
    {
        ADD: Symbol(DfiModel.prototype.constructor.name + ":add"),
        REMOVE: Symbol(DfiModel.prototype.constructor.name + ":delete"),
        UPDATE: Symbol(DfiModel.prototype.constructor.name + ":update")
    }
);
