import DfiObject = require("./src/dfiObject");
import DfiEventObject = require("./src/dfiEventObject");
import DfiModel = require("./src/dfiModel");
import DfiCollection = require("./src/dfiCollection");
import DfiUtil = require("./src/dfiUtil");
import {IDfiBaseCollectionConfig, IDfiBaseCollectionEvents, IDfiBaseEventObjectEvents, IDfiBaseModelConfig, IDfiBaseModelEvents, IDfiBaseObjectConfig} from "./src/dfiInterfaces";

let a1: IDfiBaseObjectConfig;
let a2: IDfiBaseModelConfig;
let a3: IDfiBaseCollectionConfig<DfiModel>;
let a4: IDfiBaseEventObjectEvents;
let a5: IDfiBaseModelEvents;
let a6: IDfiBaseCollectionEvents;


declare module "local-dfi-base" {

    export {
        DfiObject,
        DfiEventObject,
        DfiModel,
        DfiCollection,
        DfiUtil
        IDfiBaseCollectionConfig,
        IDfiBaseCollectionEvents,
        IDfiBaseEventObjectEvents,
        IDfiBaseModelConfig,
        IDfiBaseModelEvents,
        IDfiBaseObjectConfig,
    };
}