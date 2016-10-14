import EventEmitter = require("./dfiEventEmitter");
import {IDfiBaseEventObjectEvents, IDfiBaseObjectConfig, TEventName} from "./dfiInterfaces";
import DfiObject = require("./dfiObject");

abstract class DfiEventObject extends DfiObject {

    constructor(options?: IDfiBaseObjectConfig) {
        super(options);
        this.setProp("emitter", new EventEmitter());
    }

    get eventNames() {
        return this._ee.eventNames();
    }

    private get _ee(): EventEmitter {
        return this.getProp("emitter");
    }

    static get events(): IDfiBaseEventObjectEvents {
        return EVENTS;
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

    public off(event: TEventName, fn?: Function, context?: any, once?: boolean): EventEmitter {

        if (event === undefined) {
            throw new Error("undefined event");
        } else if (typeof event !== "symbol") {
            this.logger.warn('off event not symbol "%s"', event);
        }

        if (!this._ee.eventNames(true)) {
            return;
        }

        return this._ee.removeListener(event, fn, context, once);
    }

    public removeAllListeners(event?: string): EventEmitter {
        return this._ee.removeAllListeners(event);
    }

    protected emit(event: TEventName, ...args): boolean {
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
            let arg = Array.prototype.slice.call(arguments);
            arg.unshift(EVENTS.ALL);
            ret = this._ee.emit.apply(this._ee, arg);
        } else {
            ret = this._ee.emit.apply(this._ee, arguments);
        }
        return ret;
    }

    protected destroy() {
        this.emit(DfiEventObject.events.DESTROY);
        this.removeAllListeners();

        super.destroy();
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
