import {IDfiBaseModelAttribs, IDfiBaseModelConfig, IDfiBaseModelEvents} from "./dfiInterfaces";
import DfiEventObject = require("./dfiEventObject");

const modelUniqueId = (() => {
    let nextId = 1;
    return () => {
        return nextId++;
    };
})();

const PROP_ATTRIBUTES = "attributes";
const PROP_ID_ATTRIBUTE = "idAttribute";
const PROP_ID = "id";
const PROP_LAST_UPDATE = "lastUpdate";

abstract class DfiModel extends DfiEventObject {

    static get events(): IDfiBaseModelEvents {
        return EVENTS;
    }

    protected static map: Map<string, string>;

    get id(): any {
        return this.getProp(PROP_ID);
    }

    get lastUpdate(): number {
        return this.getProp(PROP_LAST_UPDATE);
    }

    constructor(attributes?: IDfiBaseModelAttribs, options?: IDfiBaseModelConfig) {
        options = options || {};
        if (!options.loggerName) {
            options.loggerName = "dfi:model:";
        }

        super(options);

        this.setProp(PROP_ATTRIBUTES, new Map());

        this._getAttributeMap(attributes).forEach((target, source) => {
            if (attributes.hasOwnProperty(source)) {
                this.set(target, attributes[source], true);
            }
        });

        if (this.hasProp(PROP_ID_ATTRIBUTE) && this.has(this.getProp(PROP_ID_ATTRIBUTE))) {
            this.setProp(PROP_ID, this.get(this.getProp(PROP_ID_ATTRIBUTE)));
        } else if (Object.hasOwnProperty.call(attributes, PROP_ID)) {
            this.setProp(PROP_ID, attributes.id);
        } else {
            this.setProp(PROP_ID, options.loggerName + modelUniqueId());
        }

        this.stampLastUpdate();
    }

    public destroy() {
        this.getProp(PROP_ATTRIBUTES).clear();
        super.destroy();
        this.destroyed = true;
    }

    public toJSON(): object {
        const attr = {id: this.id};
        this.getProp(PROP_ATTRIBUTES).forEach((value, name) => {
            attr[name] = value;
        });
        return attr;
    }

    public toPlain(): object {
        const attr = {};
        this.getProp(PROP_ATTRIBUTES).forEach((value, name) => {
            attr[name] = value;
        });

        const prop = super.toPlain();
        return {attr, prop};
    }

    protected get(attribute: string): any {
        if (this.getProp(PROP_ATTRIBUTES)) {
            if (this.getProp(PROP_ATTRIBUTES).has(attribute)) {
                return this.getProp(PROP_ATTRIBUTES).get(attribute);
            }
        }
        return undefined;
    }

    protected has(attribute: string): boolean {
        return this.getProp(PROP_ATTRIBUTES).has(attribute);
    }

    protected set(attribute: string | object, value: any, silent?: boolean): this {
        if (typeof attribute === "object") {
            silent = value;
            for (const attr in attribute) {
                if (attribute.hasOwnProperty(attr)) {
                    this.set(attr, attribute[attr], silent);
                }
            }
            return this;
        }

        const old = this.get(attribute);
        if (old === value) {
            return;
        }

        this.getProp(PROP_ATTRIBUTES).set(attribute, value);
        this.stampLastUpdate();
        if (silent !== true) {
            if (old === undefined) {
                this.emit(DfiModel.events.ADD, this, attribute, value);
            }
            this.emit(DfiModel.events.UPDATE, this, attribute, value, old);
        }
        return this;

    }

    protected remove(attribute) {
        const value = this.getProp(PROP_ATTRIBUTES).get(attribute);
        const ret = this.getProp(PROP_ATTRIBUTES).delete(attribute);

        this.emit(DfiModel.events.REMOVE, this, attribute, value);
        this.emit(DfiModel.events.UPDATE, this, attribute, value);
        return ret;
    }

    protected stampLastUpdate(): void {
        this.setProp(PROP_LAST_UPDATE, Date.now());
    }

    private _getAttributeMap(attributes: object): Map<string, string> {
        if ((this.constructor as typeof DfiModel).map) {
            return (this.constructor as typeof DfiModel).map;
        } else {
            const result = new Map();
            const keys = Object.keys(attributes);
            for (let i = 0, length = keys.length; i < length; i++) {
                result.set(keys[i], keys[i]);
            }
            return result;
        }
    }
}

export = DfiModel;

const EVENTS: IDfiBaseModelEvents = {
    ...DfiEventObject.events,

    ADD: Symbol(DfiModel.prototype.constructor.name + ":add"),
    REMOVE: Symbol(DfiModel.prototype.constructor.name + ":delete"),
    UPDATE: Symbol(DfiModel.prototype.constructor.name + ":update")
};
