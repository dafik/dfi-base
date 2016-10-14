/// <reference types="lodash" />
import DebugLogger = require("local-dfi-debug-logger/debugLogger");
import { IDfiBaseObjectConfig } from "./dfiInterfaces";
declare abstract class DfiObject {
    destroyed?: boolean;
    constructor(options?: IDfiBaseObjectConfig);
    readonly options: IDfiBaseObjectConfig;
    readonly logger: DebugLogger;
    toPlain(): Object;
    protected getProp(key: any): any;
    protected setProp(key: any, value: any): DfiObject;
    protected hasProp(key: any): boolean;
    protected removeProp(key: any): boolean;
    protected destroy(): void;
    protected __getProp(): Map<any, any>;
}
export = DfiObject;
