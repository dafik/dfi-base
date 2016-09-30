import DebugLogger = require("local-dfi-debug-logger/debugLogger");
import EventEmitter = require("./dfiEventEmitter");
import {IDfiBaseObjectConfig, IDfiBaseObjectEvents} from "./dfiInterfaces";


var privateProperties: WeakMap<DfiObject,Map<any,any>> = new WeakMap();


abstract class DfiObject {
    destroyed?: boolean;

    constructor(options?: IDfiBaseObjectConfig) {

        privateProperties.set(this, new Map());
        options = options || {};

        this.setProp('logger', new DebugLogger((options.loggerName ? options.loggerName : 'dfi:object:') + this.constructor.name));
        this.setProp('emitter', new EventEmitter());

        for (let property in options) {
            if (property != 'loggerName') {
                this.setProp(property, options[property]);
            }
        }
    }

    get options(): IDfiBaseObjectConfig {
        return privateProperties.get(this).get('options');
    }

    get logger(): DebugLogger {
        return privateProperties.get(this).get('logger');
    }

    getProp(key: any): any {
        return privateProperties.get(this).get(key);
    }

    setProp(key: any, value: any): DfiObject {
        privateProperties.get(this).set(key, value);
        return this;
    }

    hasProp(key): boolean {
        return privateProperties.get(this).has(key);
    }

    removeProp(key): boolean {
        return privateProperties.get(this).delete(key);
    }

    private get _ee(): EventEmitter {
        return this.getProp('emitter');
    }


    on(event: string | symbol, fn: Function, context?: any): EventEmitter {
        if (event == undefined) {
            throw new Error('undefined event')
        } else if (typeof event != 'symbol') {
            this.logger.warn('on event not symbol "%s"', event)
        }
        var ret = this._ee.on(event, fn, context);

        if (this._ee.eventNames(true).length > 10) {
            this.logger.error('memory leak detected: ')
        }
        return ret
    }

    get eventNames() {
        return this._ee.eventNames();
    }


    once(event: string | symbol, fn: Function, context?: any): EventEmitter {
        if (event == undefined) {
            throw new Error('undefined event')
        } else if (typeof event != 'symbol') {
            this.logger.warn('once event not symbol "%s"', event)
        }

        var ret = this._ee.once(event, fn, context);

        if (this._ee.eventNames().length > 10) {
            this.logger.error('memory leak detected: ')
        }
        return ret
    }


    emit(event: string | symbol, ...args): boolean {
        let ret;

        if (event == undefined) {
            throw new Error('undefined event')
        } else if (typeof event != 'symbol') {
            this.logger.warn('emit event not symbol "%s"', event)
        }

        if (!this._ee.listeners(event, true) && !this._ee.listeners(DfiObject.events.ALL, true)) return false;

        if (this._ee.listeners(DfiObject.events.ALL, true)) {
            if (this._ee.listeners(event, true)) {
                this._ee.emit.apply(this._ee, arguments);
            }
            let args = Array.prototype.slice.call(arguments);
            args.unshift(Events.ALL);
            ret = this._ee.emit.apply(this._ee, args);
        } else {
            ret = this._ee.emit.apply(this._ee, arguments)
        }
        return ret;
    }


    off(event: string, fn?: Function, context?: any, once?: boolean): EventEmitter {

        if (event == undefined) {
            throw new Error('undefined event')
        } else if (typeof event != 'symbol') {
            this.logger.warn('off event not symbol "%s"', event)
        }

        if (!this._ee.eventNames(true)) {
            return;
        }

        return this._ee.removeListener(event, fn, context, once);
    }


    removeAllListeners(event?: string): EventEmitter {
        return this._ee.removeAllListeners(event);
    }

    destroy() {
        this.emit(DfiObject.events.DESTROY);
        this.removeAllListeners();

        privateProperties.get(this).clear();
        privateProperties.delete(this);

        this.destroyed = true;
    }

    __getProp() {
        return privateProperties.get(this);
    }

    toPlain(): Object {
        let prop = {};
        let p = this.__getProp();
        if (p) {
            p.forEach((value, name) => {
                if (name !== 'attributes') {
                    prop[name] = value
                }
            });
        }
        return prop;
    }


    static get events(): IDfiBaseObjectEvents {
        return Events;
    }
}


const Events: IDfiBaseObjectEvents = Object.assign(
    {},
    {
        ALL: Symbol(DfiObject.prototype.constructor.name + ':all'),
        DESTROY: Symbol(DfiObject.prototype.constructor.name + ':destroy')
    }
);

export = DfiObject;