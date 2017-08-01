import DfiEventObject from "./dfiEventObject";
import { IDfiBaseCollectionConfig, IDfiBaseCollectionEvents, TEventName } from "./dfiInterfaces";
import DfiModel from "./dfiModel";
export declare abstract class DfiCollection<K, M extends DfiModel> extends DfiEventObject {
    static readonly events: IDfiBaseCollectionEvents;
    readonly size: number;
    private readonly _proxyHandlers;
    constructor(options?: IDfiBaseCollectionConfig<M>);
    destroy(): void;
    toJSON(): object;
    protected has(element: M | any): boolean;
    protected get(id: any): M;
    protected add(element: M): this;
    protected remove(element: M | any): boolean;
    protected keys(): any[];
    protected clear(): this;
    protected forEach(fn: (value: M, index: K, map: Map<K, M>) => void, thisArg?: any): void;
    protected toArray(): M[];
    protected proxyOn(event: TEventName, fn: (...args) => void, context?: any): this;
    protected proxyOff(event: TEventName, fn: (...args) => void, context?: any): this;
    protected proxyOffAll(): this;
    private _onMemberAll(event);
    private _proxyEventHandlers(event);
}
export default DfiCollection;
