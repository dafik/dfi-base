import DfiObject, {IDfiBaseObjectConfig, IDfiBaseObjectEvents} from "./dfiObject";
import DfiModel from "./dfiModel";


export interface IDfiBaseCollectionConfig extends IDfiBaseObjectConfig {
    idField?: string,
    model?: string
}


abstract class DfiCollection extends DfiObject {

    constructor(options: IDfiBaseCollectionConfig) {
        options.loggerName = 'dfi:collection:';

        super(options);

        super.set('collection', new Map());
        super.set('proxyCallbacks', new Map());

        if (options.idField) {
            super.set('idField', options.idField);
        }
        if (options.model) {
            super.set('model', options.model);
        }

    }

    has<T extends DfiModel>(element: T): boolean {
        let id;
        if (super.get('model') && element instanceof super.get('model')) {
            id = this._getId(element)
        } else {
            id = element;
        }
        return super.get('collection').has(id);
    }

    get<T extends DfiModel>(id): T {

        return super.get('collection').get(id);
    }

    add<T extends DfiModel>(element: T): Map<any,any> {
        let id = this._getId(element), res;
        if (!id) {
            this.logger.error('no id for model found');
        } else {
            if (!element.id) {
                element.id = id;
            }
            res = super.get('collection').set(id, element);

            element.on(DfiObject.events.ALL, this._onMemberAll, this);


            this.emit(DfiCollection.events.ADD, element, super.get('collection'));
            this.emit(DfiCollection.events.UPDATE, super.get('collection'), element, 1);
        }
        return res
    }

    remove<T extends DfiModel>(element: T): boolean {
        let id;
        if (element instanceof super.get('model')) {
            id = this._getId(element)
        } else {
            id = element;
        }
        element = super.get('collection').get(id);
        let res = false;
        if (element) {
            res = super.get('collection').delete(id);
            element.on(DfiObject.events.ALL, this._onMemberAll, this);

            this.emit(DfiCollection.events.DELETE, element, super.get('collection'));
            this.emit(DfiCollection.events.UPDATE, super.get('collection'), element, -1);
        }
        return res
    }

    keys(): Array<any> {
        var keys = [];
        var iterator = super.get('collection').keys();

        for (let key of iterator) {
            keys.push(key);
        }
        return keys;
    }

    clear(): this {
        super.get('collection').clear();
        this.emit(DfiCollection.events.UPDATE, super.get('collection'), null, 0);
        return this;
    }

    forEach(callback, thisArg): void {
        return super.get('collection').forEach(callback, thisArg);
    }

    private _getId(element) {
        let idField = super.get('idField') || 'id';
        return element.get(idField);
    }

    toArray() {
        var entries = [];
        var iterator = super.get('collection').values();

        for (let value of iterator) {
            entries.push(value);
        }
        return entries;
    }

    toJSON() {
        let out = {
            size: super.get('collection').size,
            entries: Object.create(null)
        };
        super.get('collection').forEach((value, key)=> {
            out['entries'][key] = value
        });


        return out;
    }

    get size() {
        return super.get('collection').size;
    }

    destroy() {
        this.removeAllListeners();
        delete super.get('collection');
    }

    _onMemberAll(event) {
        if (super.get('proxyCallbacks').size > 0) {
            if (super.get('proxyCallbacks').has(event)) {
                let args = Array.prototype.slice.call(arguments);
                args.shift();
                let handlers = super.get('proxyCallbacks').get(event);
                handlers.forEach((handler)=> {
                    handler.f.apply(handler.t, args);
                })
            } else if (super.get('proxyCallbacks').has(DfiObject.events.ALL)) {
                let args = Array.prototype.slice.call(arguments);
                let handlers = super.get('proxyCallbacks').get(DfiObject.events.ALL);
                handlers.forEach((handler)=> {
                    handler.c.apply(handler.t, args);
                })
            }
        }
    }

    proxyOn(event: string | symbol, fn: Function, context?: any) {

        let proxyCallbacks = super.get('proxyCallbacks');
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
        let handlers = super.get('proxyCallbacks').get(event);
        if (handlers) {
            handlers.forEach((handler)=> {
                if ((handler.c == fn && handler.t == context) || !fn) {
                    handlers.delete(handler);
                }
            });
            if (handlers.size == 0) {
                super.get('proxyCallbacks').delete(event);
            }
        }
    }

    proxyOffAll(): void {
        super.get('proxyCallbacks').forEach((handlers, event)=> {
            handlers.forEach((handler) => {
                this.proxyOff(event, handler.c, handler.t);
            })
        });
    }

    static get events(): IDfiBaseCollectionEvents {
        return Events;
    }
}


export default  DfiCollection;

export interface IDfiBaseCollectionEvents extends IDfiBaseObjectEvents {
    ADD: symbol,
    DELETE: symbol,
    UPDATE: symbol
}
const Events: IDfiBaseCollectionEvents = Object.assign(DfiModel.events, {
    ADD: Symbol(DfiObject.prototype.constructor.name + ':add'),
    DELETE: Symbol(DfiObject.prototype.constructor.name + ':delete'),
    UPDATE: Symbol(DfiObject.prototype.constructor.name + ':update')
});



