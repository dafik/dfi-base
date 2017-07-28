import DebugLogger from "local-dfi-debug-logger";
import { IDfiBaseObjectConfig } from "./dfiInterfaces";
export declare abstract class DfiObject {
    destroyed?: boolean;
    readonly logger: DebugLogger;
    constructor(options?: IDfiBaseObjectConfig);
    destroy(): void;
    toPlain(): object;
    protected getProp(key: any): any;
    protected setProp(key: any, value: any): DfiObject;
    protected hasProp(key: any): boolean;
    protected removeProp(key: any): boolean;
}
export default DfiObject;
