import DfiObject = require("./dfiObject");
import {IDfiBaseCollectionEvents, IDfiBaseCollectionConfig} from "./dfiInterfaces";
import DfiModel = require("./dfiModel");
import DfiEventObject = require("./dfiEventObject");


abstract class DfiCollection extends DfiEventObject {

    constructor(options: IDfiBaseCollectionConfig) {

        options = options || {};
        if (!options.loggerName) {
            options.loggerName = 'dfi:collection:';
        }

        super(options);

        this.setProp('collection', new Map());
        this.setProp('proxyCallbacks', new Map());

        if (options.idField) {
            this.setProp('idField', options.idField);
        }
        if (options.model) {
            this.setProp('model', options.model);
        }

    }

    has<T extends DfiModel>(element: T | any): boolean {
        let id = (this.getProp('model') && element instanceof this.getProp('model')) ? element.id : element;
        return this.getProp('collection').has(id);
    }

    get<T extends DfiModel>(id): T {

        return this.getProp('collection').get(id);
    }

    add<T extends DfiModel>(element: T): Map<any,any> {
        let res = this.getProp('collection').set(element.id, element);

        element.on(DfiEventObject.events.ALL, this._onMemberAll, this);

        this.emit(DfiCollection.events.ADD, element, this.getProp('collection'));
        this.emit(DfiCollection.events.UPDATE, this.getProp('collection'), element, 1);

        return res
    }

    remove<T extends DfiModel>(element: T | any): boolean {
        let id = element instanceof this.getProp('model') ? element.id : element;
        element = this.getProp('collection').get(id);

        let res = false;
        if (element) {
            res = this.getProp('collection').delete(id);
            element.on(DfiEventObject.events.ALL, this._onMemberAll, this);

            this.emit(DfiCollection.events.DELETE, element, this.getProp('collection'));
            this.emit(DfiCollection.events.UPDATE, this.getProp('collection'), element, -1);
        }
        return res
    }

    keys(): Array<any> {
        var keys = [];
        var iterator = this.getProp('collection').keys();

        for (let key of iterator) {
            keys.push(key);
        }
        return keys;
    }

    clear(): this {
        this.getProp('collection').clear();
        this.emit(DfiCollection.events.UPDATE, this.getProp('collection'), null, 0);
        return this;
    }

    forEach(callback, thisArg): void {
        return this.getProp('collection').forEach(callback, thisArg);
    }

    toArray<T extends DfiModel>(): Array<T> {
        var entries = [];
        var iterator = this.getProp('collection').values();

        for (let value of iterator) {
            entries.push(value);
        }
        return entries;
    }

    toJSON(): Object {
        let out = {
            size: this.getProp('collection').size,
            entries: Object.create(null)
        };
        this.getProp('collection').forEach((value, key)=> {
            out['entries'][key] = value
        });


        return out;
    }

    get size() {
        return this.getProp('collection').size;
    }

    destroy() {
        this.removeAllListeners();
        this.getProp('collection').clear();
        this.proxyOffAll();
        super.destroy();
    }

    _onMemberAll(event) {
        if (this.getProp('proxyCallbacks').size > 0) {
            if (this.getProp('proxyCallbacks').has(event)) {
                let args = Array.prototype.slice.call(arguments);
                args.shift();
                let handlers = this.getProp('proxyCallbacks').get(event);
                handlers.forEach((handler)=> {
                    handler.f.apply(handler.t, args);
                })
            } else if (this.getProp('proxyCallbacks').has(DfiEventObject.events.ALL)) {
                let args = Array.prototype.slice.call(arguments);
                let handlers = this.getProp('proxyCallbacks').get(DfiEventObject.events.ALL);
                handlers.forEach((handler)=> {
                    handler.c.apply(handler.t, args);
                })
            }
        }
    }

    proxyOn(event: string | symbol, fn: Function, context?: any) {

        let proxyCallbacks = this.getProp('proxyCallbacks');
        if (!proxyCallbacks.has(event)) {
            proxyCallbacks.set(event, new Set());
        }
        let assigner = {
            c: fn,
            t: context,
        };
        let handlers = proxyCallbacks.get(event);
        handlers.add(assigner);

    }

    proxyOff(event: string | symbol, fn: Function, context?: any): void {
        let handlers = this.getProp('proxyCallbacks').get(event);
        if (handlers) {
            handlers.forEach((handler)=> {
                if ((handler.c == fn && handler.t == context) || !fn) {
                    handlers.delete(handler);
                }
            });
            if (handlers.size == 0) {
                this.getProp('proxyCallbacks').delete(event);
            }
        }
    }

    proxyOffAll(): void {
        this.getProp('proxyCallbacks').forEach((handlers, event)=> {
            handlers.forEach((handler) => {
                this.proxyOff(event, handler.c, handler.t);
            })
        });
    }

    static get events(): IDfiBaseCollectionEvents {
        return Events;
    }
}


export =  DfiCollection;


const Events: IDfiBaseCollectionEvents = Object.assign(
    Object.assign({}, DfiEventObject.events),
    {
        ADD: Symbol(DfiCollection.prototype.constructor.name + ':add'),
        DELETE: Symbol(DfiCollection.prototype.constructor.name + ':delete'),
        UPDATE: Symbol(DfiCollection.prototype.constructor.name + ':update')
    }
);



