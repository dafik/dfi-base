import DfiObject= require("./src/dfiObject");
import DfiModel = require("./src/dfiModel");
import DfiCollection = require("./src/dfiCollection");
import EventEmitter  = require("./src/dfiEventEmitter");
import {IDfiBaseObjectConfig, IDfiBaseModelConfig, IDfiBaseCollectionConfig, IDfiBaseObjectEvents, IDfiBaseModelEvents, IDfiBaseCollectionEvents} from "./src/dfiInterfaces";

export {
    DfiObject,
    DfiModel,
    DfiCollection,
    EventEmitter,

    IDfiBaseObjectConfig,
    IDfiBaseModelConfig,
    IDfiBaseCollectionConfig,

    IDfiBaseObjectEvents,
    IDfiBaseModelEvents,
    IDfiBaseCollectionEvents
};
