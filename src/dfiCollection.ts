import {IDfiBaseCollectionConfig, IDfiBaseCollectionEvents, TEventName} from "./dfiInterfaces";
import DfiEventObject = require("./dfiEventObject");
import DfiModel = require("./dfiModel");

const COLLECTION = "collection";
const PROXY_CALLBACKS = "proxyCallbacks";
const ID_FIELD = "idField";
const MODEL = "model";
const LOGGER_NAME = "dfi:collection:";

abstract class DfiCollection<M extends DfiModel> extends DfiEventObject {

    constructor(options?: IDfiBaseCollectionConfig) {

        options = options || {};
        if (!options.loggerName) {
            options.loggerName = LOGGER_NAME;
        }

        super(options);

        this.setProp(COLLECTION, new Map());
        this.setProp(PROXY_CALLBACKS, new Map());

        if (options.idField) {
            this.setProp(ID_FIELD, options.idField);
        }
        if (options.model) {
            this.setProp(MODEL, options.model);
        }

    }

    get size() {
        return this.getProp(COLLECTION).size;
    }

    static get events(): IDfiBaseCollectionEvents {
        return EVENTS;
    }

    public toJSON(): Object {
        let out = {
            entries: Object.create(null),
            size: this.getProp(COLLECTION).size
        };
        this.getProp(COLLECTION).forEach((value, key) => {
            out.entries[key] = value;
        });
        return out;
    }

    protected has(element: M | any): boolean {
        let id;

        if (typeof element === "object") {
            id = (this.getProp(MODEL) && element instanceof this.getProp(MODEL)) ? element.id : element;
        } else {
            id = element;
        }
        return this.getProp(COLLECTION).has(id);
    }

    protected get(id): M {

        return this.getProp(COLLECTION).get(id);
    }

    protected  add(element: M): Map<any, M> {
        let res = this.getProp(COLLECTION).set(element.id, element);

        element.on(DfiEventObject.events.ALL, this._onMemberAll, this);

        this.emit(DfiCollection.events.ADD, element, this.getProp(COLLECTION));
        this.emit(DfiCollection.events.UPDATE, this.getProp(COLLECTION), element, 1);

        return res;
    }

    protected  remove(element: M | any): boolean {
        let id = element instanceof this.getProp(MODEL) ? element.id : element;
        element = this.getProp(COLLECTION).get(id);

        let res = false;
        if (element) {
            res = this.getProp(COLLECTION).delete(id);
            element.on(DfiEventObject.events.ALL, this._onMemberAll, this);

            this.emit(DfiCollection.events.REMOVE, element, this.getProp(COLLECTION));
            this.emit(DfiCollection.events.UPDATE, this.getProp(COLLECTION), element, -1);
        }
        return res;
    }

    protected keys(): Array<any> {
        return [...this.getProp(COLLECTION).keys()];
    }

    protected  clear(): this {
        this.getProp(COLLECTION).clear();
        this.emit(DfiCollection.events.UPDATE, this.getProp(COLLECTION), null, 0);
        return this;
    }

    protected forEach(fn: (value: M, index: any, map: Map<any, M>) => void, context?: any): void {
        return this.getProp(COLLECTION).forEach(fn, context);
    }

    protected toArray(): Array<M> {
        return [...this.getProp(COLLECTION).values()];
    }

    protected destroy() {
        this.removeAllListeners();
        this.getProp(COLLECTION).clear();
        this.proxyOffAll();
        super.destroy();
    }

    protected proxyOn(event: TEventName, fn: Function, context?: any) {

        let proxyCallbacks = this.getProp(PROXY_CALLBACKS);
        if (!proxyCallbacks.has(event)) {
            proxyCallbacks.set(event, new Set());
        }
        let assigner = {
            c: fn,
            t: context
        };
        let handlers = proxyCallbacks.get(event);
        handlers.add(assigner);

    }

    protected proxyOff(event: TEventName, fn: Function, context?: any): void {
        let handlers = this.getProp(PROXY_CALLBACKS).get(event);
        if (handlers) {
            handlers.forEach((handler) => {
                if ((handler.c === fn && handler.t === context) || !fn) {
                    handlers.delete(handler);
                }
            });
            if (handlers.size === 0) {
                this.getProp(PROXY_CALLBACKS).delete(event);
            }
        }
    }

    protected proxyOffAll(): void {
        this.getProp(PROXY_CALLBACKS).forEach((handlers, event) => {
            handlers.forEach((handler) => {
                this.proxyOff(event, handler.c, handler.t);
            });
        });
    }

    private _onMemberAll(event) {
        if (this.getProp(PROXY_CALLBACKS).size > 0) {
            if (this.getProp(PROXY_CALLBACKS).has(event)) {
                let args = Array.prototype.slice.call(arguments);
                args.shift();
                let handlers = this.getProp(PROXY_CALLBACKS).get(event);
                handlers.forEach((handler) => {
                    handler.f.apply(handler.t, args);
                });
            } else if (this.getProp(PROXY_CALLBACKS).has(DfiEventObject.events.ALL)) {
                let args = Array.prototype.slice.call(arguments);
                let handlers = this.getProp(PROXY_CALLBACKS).get(DfiEventObject.events.ALL);
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
