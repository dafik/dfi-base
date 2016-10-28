import DfiObject = require("./src/dfiObject");
import DfiEventObject = require("./src/dfiEventObject");
import DfiModel = require("./src/dfiModel");
import DfiCollection = require("./src/dfiCollection");
import DfiUtil = require("./src/dfiUtil");
import {IDfiBaseCollectionConfig, IDfiBaseCollectionEvents, IDfiBaseEventObjectEvents, IDfiBaseModelConfig, IDfiBaseModelEvents, IDfiBaseObjectConfig} from "./src/dfiInterfaces";

declare let a1: IDfiBaseObjectConfig;
declare let a2: IDfiBaseModelConfig;
declare let a3: IDfiBaseCollectionConfig<DfiModel>;
declare let a4: IDfiBaseEventObjectEvents;
declare let a5: IDfiBaseModelEvents;
declare let a6: IDfiBaseCollectionEvents;

declare module "local-dfi-base" {

    export {
        DfiObject,
        DfiEventObject,
        DfiModel,
        DfiCollection,
        DfiUtil,
        IDfiBaseCollectionConfig,
        IDfiBaseCollectionEvents,
        IDfiBaseEventObjectEvents,
        IDfiBaseModelConfig,
        IDfiBaseModelEvents,
        IDfiBaseObjectConfig,
        a1,
        a2,
        a3,
        a4,
        a5,
        a6
    };
}