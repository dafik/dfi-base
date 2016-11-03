import EventEmitter = require("./dfiEventEmitter");
import {IDfiBaseEventObjectEvents, IDfiBaseObjectConfig, TEventName} from "./dfiInterfaces";
import DfiObject = require("./dfiObject");

abstract class DfiEventObject extends DfiObject {

    static get events(): IDfiBaseEventObjectEvents {
        return EVENTS;
    }

    get eventNames() {
        return this._ee.eventNames();
    }

    constructor(options?: IDfiBaseObjectConfig) {
        super(options);
        this.setProp("emitter", new EventEmitter());
    }

    public destroy() {
        this.emit(DfiEventObject.events.DESTROY, this);
        this.removeAllListeners();

        super.destroy();
    }

    public on(event: TEventName, fn: Function, context?: any): EventEmitter {
        if (event === undefined) {
            throw new Error("undefined event");
        } else if (typeof event !== "symbol") {
            this.logger.warn('on event not symbol "%s"', event);
        }
        let ret = this._ee.on(event, fn, context);

        if (this._ee.eventNames(true).length > 10) {
            this.logger.error("memory leak detected: ");
        }
        return ret;
    }

    public once(event: TEventName, fn: Function, context?: any): EventEmitter {
        if (event === undefined) {
            throw new Error("undefined event");
        } else if (typeof event !== "symbol") {
            this.logger.warn('once event not symbol "%s"', event);
        }

        let ret = this._ee.once(event, fn, context);

        if (this._ee.eventNames().length > 10) {
            this.logger.error("memory leak detected: ");
        }
        return ret;
    }

    public emit(event: TEventName, ...args): boolean {
        let ret;

        if (event === undefined) {
            throw new Error("undefined event");
        } else if (typeof event !== "symbol") {
            this.logger.warn('emit event not symbol "%s"', event);
        }

        if (!this._ee.listeners(event, true) && !this._ee.listeners(DfiEventObject.events.ALL, true)) {
            return false;
        }

        if (this._ee.listeners(DfiEventObject.events.ALL, true)) {
            if (this._ee.listeners(event, true)) {
                this._ee.emit.apply(this._ee, arguments);
            }
            let newArgs = Array.prototype.slice.call(arguments);
            newArgs.unshift(EVENTS.ALL);
            ret = this._ee.emit.apply(this._ee, newArgs);
        } else {
            ret = this._ee.emit.apply(this._ee, arguments);
        }
        return ret;
    }

    public off(event: TEventName, fn?: Function, context?: any, once?: boolean): EventEmitter {

        if (event === undefined) {
            throw new Error("undefined event");
        } else if (typeof event !== "symbol") {
            this.logger.warn("off event not symbol %s", event);
        }

        if (!this._ee.eventNames(true)) {
            return;
        }

        return this._ee.removeListener(event, fn, context, once);
    }

    public removeAllListeners(event?: string): EventEmitter {
        return this._ee.removeAllListeners(event);
    }

    private get _ee(): EventEmitter {
        return this.getProp("emitter");
    }
}

const EVENTS: IDfiBaseEventObjectEvents = Object.assign(
    {},
    {
        ALL: Symbol(DfiEventObject.prototype.constructor.name + ":all"),
        DESTROY: Symbol(DfiEventObject.prototype.constructor.name + ":destroy")
    }
);

export = DfiEventObject;
