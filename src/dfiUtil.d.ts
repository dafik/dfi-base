import { IDfiCallbackResult } from "./dfiInterfaces";
export declare class DfiUtil {
    static maybeCallbackOnce(fn: IDfiCallbackResult, context: any, err?: any, response?: any): void;
    static maybeCallback(fn: IDfiCallbackResult, context: any, err?: any, response?: any): void;
    static obj2map<V>(obj: {
        [key: string]: V;
    }): Map<string, V>;
    static cloneLiteral(literal: {}): any;
    private static readonly logger;
    private static _entries<V>(obj);
}
export default DfiUtil;
