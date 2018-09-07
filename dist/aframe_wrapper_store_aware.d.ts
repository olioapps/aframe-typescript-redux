/// <reference types="aframe" />
import { Store } from "redux";
import { ComponentWrapper, SystemWrapper } from "aframe-typescript-toolkit";
import StoreAware from "./store_aware";
import { BaseRepository, RepositoryMember, BaseMap } from "./core";
export declare abstract class StoreAwareComponent<PROPS, SHARED_STATE = {}, SCHEMA = {}> extends ComponentWrapper<SCHEMA> {
    storeAware: StoreAware<PROPS>;
    store: Store;
    private sharedState;
    constructor(store: Store, name: string, props?: PROPS, schema?: {});
    abstract componentWillReceiveProps(props: PROPS, nextProps: PROPS): void;
    getSharedState(): SHARED_STATE;
    setSharedState(sharedState: SHARED_STATE): void;
}
/**
 * Watches the whole store
 */
export declare abstract class StoreAwareSystem<PROPS, SHARED_STATE = {}, SCHEMA = {}> extends SystemWrapper<SCHEMA> {
    storeAware: StoreAware<PROPS>;
    store: Store;
    private sharedState;
    constructor(store: Store, name: string, props?: PROPS, schema?: {});
    abstract componentWillReceiveProps(props: PROPS, nextProps: PROPS): void;
    getSharedState(): SHARED_STATE;
    setSharedState(sharedState: SHARED_STATE): void;
}
/**
 * Maintains a 1:1 relationship between a store object we want to watch, and
 * an aframe entity component instance
 */
export declare abstract class StoreAwareRepositoryComponent<PROPS, STORE_OBJECT extends RepositoryMember, STORE_REPOSITORY extends BaseRepository<STORE_OBJECT>, SCHEMA = {}> extends StoreAwareComponent<PROPS, Map<string, any>, SCHEMA> {
    constructor(store: Store, name: string, props?: PROPS, schema?: {});
    componentWillReceiveProps(props: PROPS, nextProps: PROPS): void;
    determineEntitiesToCreate(props: PROPS, nextProps: PROPS): STORE_OBJECT[];
    determineEntitiesToDestroy(props: PROPS, nextProps: PROPS): STORE_OBJECT[];
    determineEntitiesToUpdate(props: PROPS, nextProps: PROPS): STORE_OBJECT[];
    abstract resolveRepository(props: PROPS): STORE_REPOSITORY;
    abstract resolveStoreObject(data: SCHEMA): STORE_OBJECT;
    abstract onStoreObjectCreate(bullet: STORE_OBJECT): AFrame.ANode;
    onStoreObjectUpdate(entity: STORE_OBJECT, component: this): void;
    beforeStoreObjectDestroy(entity: STORE_OBJECT, w: this): void;
    private updateEntity;
    private createEntity;
    private destroyEntity;
    private getEntityComponentsFor;
    private updateEntityComponents;
    /**
     * by default, register aframe component instance
     */
    init(): void;
}
interface ReduxConnectedComponentSchema {
    readonly propsToHandlerMapping: BaseMap<string>;
}
export declare class ReduxConnectedComponent extends ComponentWrapper<ReduxConnectedComponentSchema, ReduxConnectedSystem> {
    constructor();
    init(): void;
}
interface ReduxConnectedProps {
}
interface ReduxConnectorSharedState {
    propsToComponentMapping: BaseMap<ComponentFunction[]>;
}
interface ComponentFunction {
    component: ReduxConnectedComponent;
    callback: string;
}
export declare class ReduxConnectedSystem extends StoreAwareSystem<{}, ReduxConnectorSharedState> {
    constructor(store: Store, props?: {});
    connect(component: ReduxConnectedComponent): void;
    componentWillReceiveProps(props: ReduxConnectedProps, nextProps: ReduxConnectedProps): void;
}
export declare function dispatch(component: ComponentWrapper, action: {}): void;
export {};
