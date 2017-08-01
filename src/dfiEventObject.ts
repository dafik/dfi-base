import EventEmitter from "./dfiEventEmitter";
import {IDfiBaseEventObjectEvents, IDfiBaseObjectConfig, TEventName} from "./dfiInterfaces";
import DfiObject from "./dfiObject";

const PROP_MAX_EVENTS = "maxEvents";
const PROP_EMITTER = "emitter";

export abstract class DfiEventObject extends DfiObject {

    static get events(): IDfiBaseEventObjectEvents {
        return EVENTS;
    }

    get eventNames() {
        return this._ee.eventNames();
    }

    get maxEvents() {
        return this.getProp(PROP_MAX_EVENTS);
    }

    private get _ee(): EventEmitter {
        return this.getProp("emitter");
    }

    constructor(options?: IDfiBaseObjectConfig) {
        options.maxEvents = options.maxEvents || 10;
        super(options);
        this.setProp(PROP_EMITTER, new EventEmitter());
    }

    public destroy() {
        this.emit(DfiEventObject.events.DESTROY, this);
        this.removeAllListeners();

        super.destroy();
    }

    public on(event: TEventName, fn: (...args) => void, context?: any): EventEmitter {
        if (event === undefined) {
            throw new Error("undefined event");
        } else if (typeof event !== "symbol") {
            this.logger.warn('on event not symbol "%s"', event);
        }
        const ret = this._ee.on(event, fn, context);

        if (this._ee.eventNames(true).length > this.maxEvents) {
            this.logger.error("memory leak detected: ");
        }
        return ret;
    }

    public once(event: TEventName, fn: (...args) => void, context?: any): EventEmitter {
        if (event === undefined) {
            throw new Error("undefined event");
        } else if (typeof event !== "symbol") {
            this.logger.warn('once event not symbol "%s"', event);
        }

        const ret = this._ee.once(event, fn, context);

        if (this._ee.eventNames().length > this.maxEvents) {
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
            const emitter = this._ee; // event listener can destroy the object and his emitter property, so it must be local reference.
            if (emitter.listeners(event, true)) {
                emitter.emit.apply(this._ee, arguments);
            }
            const newArgs = Array.prototype.slice.call(arguments);
            newArgs.unshift(EVENTS.ALL);
            ret = emitter.emit.apply(emitter, newArgs);
        } else {
            ret = this._ee.emit.apply(this._ee, arguments);
        }
        return ret;
    }

    public off(event: TEventName, fn?: (...args) => void, context?: any, once?: boolean): EventEmitter {

        if (event === undefined) {
            throw new Error("undefined event");
        } else if (typeof event !== "symbol") {
            this.logger.warn("off event not symbol %s", event);
        }

        if (this._ee.eventNames(true).length === 0) {
            return;
        }

        return this._ee.removeListener(event, fn, context, once);
    }

    public removeAllListeners(event?: TEventName): EventEmitter {
        return this._ee.removeAllListeners(event);
    }
}

const EVENTS: IDfiBaseEventObjectEvents = {
    ALL: Symbol(DfiEventObject.prototype.constructor.name + ":all"),
    DESTROY: Symbol(DfiEventObject.prototype.constructor.name + ":destroy")
};

export default DfiEventObject;
