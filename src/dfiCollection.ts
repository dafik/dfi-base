import DfiEventObject from "./dfiEventObject";
import {IDfiBaseCollectionConfig, IDfiBaseCollectionEvents, IDfiProxyCallback, TEventName} from "./dfiInterfaces";
import DfiModel from "./dfiModel";

const PROP_COLLECTION = "collection";
const PROP_PROXY_CALLBACKS = "proxyCallbacks";
const PROP_ID_FIELD = "idField";
const PROP_MODEL = "model";

export abstract class DfiCollection<K, M extends DfiModel> extends DfiEventObject {
    static get events(): IDfiBaseCollectionEvents {
        return EVENTS;
    }

    get size(): number {
        return this.getProp(PROP_COLLECTION).size;
    }

    private get _proxyHandlers(): Map<TEventName, Set<IDfiProxyCallback>> {
        return this.getProp(PROP_PROXY_CALLBACKS);
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

    public toJSON(): object {
        const out = {
            entries: Object.create(null),
            size: this.getProp(PROP_COLLECTION).size
        };
        this.getProp(PROP_COLLECTION).forEach((value, key) => {
            out.entries[key] = value;
        });

        return out;
    }

    protected has(element: M | any): boolean {
        const id = (this.getProp(PROP_MODEL) && element instanceof this.getProp(PROP_MODEL)) ? element.id : element;
        return this.getProp(PROP_COLLECTION).has(id);
    }

    protected get(id): M {

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
        const id = this.getProp(PROP_MODEL) && element instanceof this.getProp(PROP_MODEL) ? element.id : element;
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

    protected keys(): any[] {
        const keys = [];
        const iterator = this.getProp(PROP_COLLECTION).keys();

        for (const key of iterator) {
            keys.push(key);
        }
        return keys;
    }

    protected clear(): this {
        this.getProp(PROP_COLLECTION).clear();
        this.emit(DfiCollection.events.UPDATE, this.getProp(PROP_COLLECTION));
        return this;
    }

    protected forEach(fn: (value: M, index: K, map: Map<K, M>) => void, thisArg?: any): void {
        return this.getProp(PROP_COLLECTION).forEach(fn, thisArg);
    }

    protected toArray(): M[] {
        const entries = [];
        const iterator = this.getProp(PROP_COLLECTION).values();

        for (const value of iterator) {
            entries.push(value);
        }
        return entries;
    }

    protected proxyOn(event: TEventName, fn: (...args) => void, context?: any): this {

        const proxyCallbacks = this._proxyHandlers;
        if (!proxyCallbacks.has(event)) {
            proxyCallbacks.set(event, new Set());
        }
        const assigner: IDfiProxyCallback = {
            c: fn,
            t: context
        };
        const handlers = proxyCallbacks.get(event);
        handlers.add(assigner);
        return this;
    }

    protected proxyOff(event: TEventName, fn: (...args) => void, context?: any): this {
        const handlers = this._proxyEventHandlers(event);
        if (handlers) {
            handlers.forEach((handler) => {
                if ((handler.c === fn && handler.t === context) || !fn) {
                    handlers.delete(handler);
                }
            });
            if (handlers.size === 0) {
                this._proxyHandlers.delete(event);
            }
        }
        return this;
    }

    protected proxyOffAll(): this {
        this._proxyHandlers.forEach((handlers, event) => {
            handlers.forEach((handler) => {
                this.proxyOff(event, handler.c, handler.t);
            });
        });
        return this;
    }

    private _onMemberAll(event) {
        if (this._proxyHandlers.size > 0) {
            if (this._proxyHandlers.has(event)) {
                const args = Array.prototype.slice.call(arguments);
                args.shift();
                const handlers = this._proxyHandlers.get(event);
                handlers.forEach((handler) => {
                    handler.c.apply(handler.t, args);
                });
            }
            if (this._proxyHandlers.has(DfiEventObject.events.ALL)) {
                const args = Array.prototype.slice.call(arguments);
                const handlers = this._proxyHandlers.get(DfiEventObject.events.ALL);
                handlers.forEach((handler) => {
                    handler.c.apply(handler.t, args);
                });
            }
        }
    }

    private _proxyEventHandlers(event: TEventName): Set<IDfiProxyCallback> {
        return this._proxyHandlers.get(event);
    }
}

export default DfiCollection;

const EVENTS: IDfiBaseCollectionEvents = {
    ...DfiEventObject.events,

    ADD: Symbol(DfiCollection.prototype.constructor.name + ":add"),
    REMOVE: Symbol(DfiCollection.prototype.constructor.name + ":remove"),
    UPDATE: Symbol(DfiCollection.prototype.constructor.name + ":update")
};
