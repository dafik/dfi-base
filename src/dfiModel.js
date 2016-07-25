"use strict";
const
    DebugLogger = require('local-dfi-debug-logger'),
    DfiObject = require('./dfiObject');

/**
 * @class
 * @extends DfiObject
 * @extends EventEmitter
 * @extends EE
 */

class DfiModel extends DfiObject {
    constructor(attributes, options) {
        super(options);

        this.set('logger', new DebugLogger('live:tw:' + this.constructor.name));
        this.attributes = new Map(attributes);

        this.stampLastUpdate();

        this.initialize();
    }

    getLastUpdateMillis() {
        return super.get('lastUpdate');
    }

    stampLastUpdate() {
        super.set('lastUpdate', Date.now());
    }

    get logger() {
        return super.get('logger');
    }

    initialize() {

    }

    destroy() {
        super.destroy();

        this.attributes.clear();
        delete this.attributes;
        delete this.id;
    }

    get(attribute) {

        if (this.attributes.has(attribute)) {
            return this.attributes.get(attribute);
        }
        if (attribute == 'id' && this.hasOwnProperty('id')) {
            return this.id;
        }
        return undefined;
    }

    has(attribute) {
        return this.attributes.has(attribute);
    }

    set(attribute, value) {
        var old = this.get(attribute);
        this.attributes.set(attribute, value);
        if (old == undefined) {
            this.emit(Events.ADD, this);
        }
        this.emit(Events.UPDATE, this, attribute, value, old);

        return this;
    }

    unset(attribute) {
        return this.attributes.delete(attribute);
    }


    static get events() {
        return Events;
    }
}

const Events = {
    ADD: Symbol(DfiModel.prototype.constructor.name + ':add'),
    UPDATE: Symbol(DfiModel.prototype.constructor.name + ':update')
};


module.exports = DfiModel;