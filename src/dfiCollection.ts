import {IDfiBaseCollectionConfig, IDfiBaseCollectionEvents, TEventName} from "./dfiInterfaces";
import DfiModel = require("./dfiModel");
import DfiEventObject = require("./dfiEventObject");

const PROP_COLLECTION = "collection";
const PROP_PROXY_CALLBACKS = "proxyCallbacks";
const PROP_ID_FIELD = "idField";
const PROP_MODEL = "model";

abstract class DfiCollection<K, M extends DfiModel> extends DfiEventObject {
    static get events(): IDfiBaseCollectionEvents {
        return EVENTS;
    }

    get size(): number {
        return this.getProp(PROP_COLLECTION).size;
    }

    constructor(options?: IDfiBaseCollectionConfig<M>) {

        options = options || {};
        if (!options.loggerName) {
            options.loggerName = "dfi:collection:";
        }

        super(options);

        this.setProp(PROP_COLLECTION, new Map());
        this.setProp(PROP_PROXY_CALLBACKS, new Map());

        if (options.idField) {
            this.setProp(PROP_ID_FIELD, options.idField);
        }
        if (options.model) {
            this.setProp(PROP_MODEL, options.model);
        }

    }

    public destroy() {
        this.removeAllListeners();
        this.getProp(PROP_COLLECTION).clear();
        this.proxyOffAll();
        super.destroy();
    }

    public toJSON(): Object {
        let out = {
            entries: Object.create(null),
            size: this.getProp(PROP_COLLECTION).size
        };
        this.getProp(PROP_COLLECTION).forEach((value, key) => {
            out.entries[key] = value;
        });

        return out;
    }

    protected has(element: M | any): boolean {
        let id = (this.getProp(PROP_MODEL) && element instanceof this.getProp(PROP_MODEL)) ? element.id : element;
        return this.getProp(PROP_COLLECTION).has(id);
    }

    protected  get(id): M {

        return this.getProp(PROP_COLLECTION).get(id);
    }

    protected add(element: M): this {
        this.getProp(PROP_COLLECTION).set(element.id, element);

        element.on(DfiEventObject.events.ALL, this._onMemberAll, this);

        this.emit(DfiCollection.events.ADD, element, this.getProp(PROP_COLLECTION));
        this.emit(DfiCollection.events.UPDATE, this.getProp(PROP_COLLECTION), element, 1);
        return this;
    }

    protected remove(element: M | any): boolean {
        let id = this.getProp(PROP_MODEL) && element instanceof this.getProp(PROP_MODEL) ? element.id : element;
        element = this.getProp(PROP_COLLECTION).get(id);

        let res = false;
        if (element) {
            res = this.getProp(PROP_COLLECTION).delete(id);
            element.on(DfiEventObject.events.ALL, this._onMemberAll, this);

            this.emit(DfiCollection.events.REMOVE, element, this.getProp(PROP_COLLECTION));
            this.emit(DfiCollection.events.UPDATE, this.getProp(PROP_COLLECTION), element, -1);
        }
        return res;
    }

    protected keys(): Array<any> {
        let keys = [];
        let iterator = this.getProp(PROP_COLLECTION).keys();

        for (let key of iterator) {
            keys.push(key);
        }
        return keys;
    }

    protected clear(): this {
        this.getProp(PROP_COLLECTION).clear();
        this.emit(DfiCollection.events.UPDATE, this.getProp(PROP_COLLECTION), null, 0);
        return this;
    }

    protected forEach(fn: (value: M, index: K, map: Map<K, M>) => void, thisArg?: any): void {
        return this.getProp(PROP_COLLECTION).forEach(fn, thisArg);
    }

    protected toArray(): Array<M> {
        let entries = [];
        let iterator = this.getProp(PROP_COLLECTION).values();

        for (let value of iterator) {
            entries.push(value);
        }
        return entries;
    }

    protected proxyOn(event: TEventName, fn: Function, context?: any): this {

        let proxyCallbacks = this.getProp(PROP_PROXY_CALLBACKS);
        if (!proxyCallbacks.has(event)) {
            proxyCallbacks.set(event, new Set());
        }
        let assigner = {
            c: fn,
            t: context
        };
        let handlers = proxyCallbacks.get(event);
        handlers.add(assigner);
        return this;
    }

    protected proxyOff(event: TEventName, fn: Function, context?: any): this {
        let handlers = this.getProp(PROP_PROXY_CALLBACKS).get(event);
        if (handlers) {
            handlers.forEach((handler) => {
                if ((handler.c === fn && handler.t === context) || !fn) {
                    handlers.delete(handler);
                }
            });
            if (handlers.size === 0) {
                this.getProp(PROP_PROXY_CALLBACKS).delete(event);
            }
        }
        return this;
    }

    protected proxyOffAll(): this {
        this.getProp(PROP_PROXY_CALLBACKS).forEach((handlers, event) => {
            handlers.forEach((handler) => {
                this.proxyOff(event, handler.c, handler.t);
            });
        });
        return this;
    }

    private _onMemberAll(event) {
        if (this.getProp(PROP_PROXY_CALLBACKS).size > 0) {
            if (this.getProp(PROP_PROXY_CALLBACKS).has(event)) {
                let args = Array.prototype.slice.call(arguments);
                args.shift();
                let handlers = this.getProp(PROP_PROXY_CALLBACKS).get(event);
                handlers.forEach((handler) => {
                    handler.f.apply(handler.t, args);
                });
            } else if (this.getProp(PROP_PROXY_CALLBACKS).has(DfiEventObject.events.ALL)) {
                let args = Array.prototype.slice.call(arguments);
                let handlers = this.getProp(PROP_PROXY_CALLBACKS).get(DfiEventObject.events.ALL);
                handlers.forEach((handler) => {
                    handler.c.apply(handler.t, args);
                });
            }
        }
    }
}

export =  DfiCollection;

const EVENTS: IDfiBaseCollectionEvents = Object.assign(
    Object.assign({}, DfiEventObject.events),
    {
        ADD: Symbol(DfiCollection.prototype.constructor.name + ":add"),
        REMOVE: Symbol(DfiCollection.prototype.constructor.name + ":delete"),
        UPDATE: Symbol(DfiCollection.prototype.constructor.name + ":update")
    }
);
