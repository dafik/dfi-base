import DfiObject, {IDfiBaseObjectEvents, IDfiBaseObjectConfig} from "./dfiObject";


abstract class DfiModel extends DfiObject {

    attributes: Map<any,any>;
    id: string;

    constructor(attributes: Object, options: IDfiBaseObjectConfig) {
        options.loggerName = 'dfi:model:'

        super(options);

        this.attributes = new Map();
        for (let attribute in attributes) {
            this.set(attribute, attributes[attribute]);
        }
        for (let property in options) {
            this.setProp(property, options[property]);
        }
        if (this.hasProp('idAttribute') && this.has(this.getProp('idAttribute'))) {
            this.id = this.get(this.getProp('idAttribute'));
        }
        this.stampLastUpdate();
    }

    getLastUpdateMillis() {
        return super.get('lastUpdate');
    }

    stampLastUpdate(): void {
        this.setProp('lastUpdate', Date.now());
    }

    destroy() {
        super.destroy();

        this.attributes.clear();
        delete this.attributes;

        this.destroyed = true;

    }

    get(attribute: string): any {
        if (this.attributes) {
            if (this.attributes.has(attribute)) {
                return this.attributes.get(attribute);
            }
        } else {
            let ee = 1;
        }
        return undefined;
    }

    has(attribute: string): boolean {
        return this.attributes.has(attribute);
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
        var old = this.get(attribute);
        let ret = this.attributes.set(attribute, value);
        this.stampLastUpdate();
        if (silent != true) {
            if (old == undefined) {
                this.emit(Events.ADD, this, attribute, value);
            }
            this.emit(Events.UPDATE, this, attribute, value, old);
        }
        return this;

    }

    delete(attribute) {
        let value = this.attributes.get(attribute);
        let ret = this.attributes.delete(attribute);

        this.emit(Events.DELETE, this, attribute, value);
        this.emit(Events.UPDATE, this, attribute, value);
        return ret;
    }

    getProp(key) {
        return super.get(key);
    }

    setProp(key: any, value: any) {
        return super.set(key, value);
    }

    hasProp(key) {
        return super.has(key);
    }

    deleteProp(key) {
        return super.delete(key);
    }

    static get events(): IDfiBaseModelEvents {
        return Events;
    }

    toJSON(): Object {
        let attr = {};
        this.attributes.forEach((value, name) => {
            attr[name] = value
        });
        return attr
    }

    toPlain(): Object {
        let attr = {};
        this.attributes.forEach((value, name) => {
            attr[name] = value
        });

        let prop = {};
        this.__getProp().forEach((value, name) => {
            prop[name] = value
        });
        return {attr: attr, prop: prop};
    }
}

export default  DfiModel;

export interface IDfiBaseModelEvents extends IDfiBaseObjectEvents {
    ADD: symbol,
    DELETE: symbol,
    UPDATE: symbol
}
const Events: IDfiBaseModelEvents = Object.assign(
    Object.assign({}, DfiObject.events),
    {
        ADD: Symbol(DfiModel.prototype.constructor.name + ':add'),
        DELETE: Symbol(DfiModel.prototype.constructor.name + ':delete'),
        UPDATE: Symbol(DfiModel.prototype.constructor.name + ':update')
    }
);