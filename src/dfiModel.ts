import DfiObject = require("./dfiObject");
import {IDfiBaseModelEvents, IDfiBaseModelConfig, IDfiBaseModelAttribs} from "./dfiInterfaces";
import DfiEventObject = require("./dfiEventObject");

var ModelUniqueId = (function () {
    var nextId = 1;
    return function () {
        return nextId++;
    }
})();

abstract class DfiModel extends DfiEventObject {

    static map: Map<string,string>;

    constructor(attributes?: IDfiBaseModelAttribs, options?: IDfiBaseModelConfig) {
        options = options || {};
        if (!options.loggerName) {
            options.loggerName = 'dfi:model:'
        }

        super(options);

        this.setProp('attributes', new Map());

        if (this.hasProp('idAttribute') && this.has(this.getProp('idAttribute'))) {
            this.setProp('id', this.get(this.getProp('idAttribute')));
        } else if (Object.hasOwnProperty.call(attributes, 'id')) {
            this.setProp('id', attributes.id);
        } else {
            this.setProp('id', options.loggerName + ModelUniqueId());
        }
        this._getAttributeMap(attributes).forEach((target, source)=> {
            if (attributes.hasOwnProperty(source)) {
                this.set(target, attributes[source], true);
            }
        });

        this.stampLastUpdate();
    }

    get id(): any {
        return this.getProp('id');
    }

    get lastUpdate(): number {
        return this.getProp('lastUpdate');
    }

    stampLastUpdate(): void {
        this.setProp('lastUpdate', Date.now());
    }

    destroy() {
        this.getProp('attributes').clear();
        super.destroy();
        this.destroyed = true;
    }

    get(attribute: string): any {
        if (this.getProp('attributes')) {
            if (this.getProp('attributes').has(attribute)) {
                return this.getProp('attributes').get(attribute);
            }
        }
        return undefined;
    }

    has(attribute: string): boolean {
        return this.getProp('attributes').has(attribute);
    }

    set(attribute: string | Object, value: any, silent?: boolean): this {
        if (typeof attribute == 'object') {
            silent = value;
            for (let attr in attribute) {
                if (attribute.hasOwnProperty(attr)) {
                    this.set(attr, attribute[attr], silent)
                }
            }
            return this;
        }

        let old = this.get(attribute);
        if (old === value) {
            return;
        }

        this.getProp('attributes').set(attribute, value);
        this.stampLastUpdate();
        if (silent != true) {
            if (old == undefined) {
                this.emit(Events.ADD, this, attribute, value);
            }
            this.emit(Events.UPDATE, this, attribute, value, old);
        }
        return this;

    }

    remove(attribute) {
        let value = this.getProp('attributes').get(attribute);
        let ret = this.getProp('attributes').delete(attribute);

        this.emit(Events.REMOVE, this, attribute, value);
        this.emit(Events.UPDATE, this, attribute, value);
        return ret;
    }

    static get events(): IDfiBaseModelEvents {
        return Events;
    }

    toJSON(): Object {
        let attr = {};
        this.getProp('attributes').forEach((value, name) => {
            attr[name] = value
        });
        attr['id'] = this.id;
        return attr
    }

    toPlain(): Object {
        let attr = {};
        this.getProp('attributes').forEach((value, name) => {
            attr[name] = value
        });

        let prop = {};
        this.__getProp().forEach((value, name) => {
            if (name !== 'attributes') {
                prop[name] = value
            }

        });
        return {attr: attr, prop: prop};
    }

    private _getAttributeMap(attributes: Object): Map<string,string> {
        if ((this.constructor as typeof DfiModel).map) {
            return (this.constructor as typeof DfiModel).map
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

const Events: IDfiBaseModelEvents = Object.assign(
    Object.assign({}, DfiEventObject.events),
    {
        ADD: Symbol(DfiModel.prototype.constructor.name + ':add'),
        REMOVE: Symbol(DfiModel.prototype.constructor.name + ':delete'),
        UPDATE: Symbol(DfiModel.prototype.constructor.name + ':update')
    }
);


