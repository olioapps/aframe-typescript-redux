/// <reference types="aframe" />
import { Store } from "redux";
import { ComponentWrapper } from "aframe-typescript-toolkit";
import StoreAware from "./store_aware";
import { BaseRepository, RepositoryMember } from "./core";
/**
 * Maintains a 1:1 relationship between a store object we want to watch, and
 * an aframe entity component instance
 */
export declare abstract class StoreAwareRepositoryComponent<PROPS, STORE_OBJECT extends RepositoryMember, STORE_REPOSITORY extends BaseRepository<STORE_OBJECT>, SCHEMA = {}> extends ComponentWrapper<SCHEMA> {
    storeAware: StoreAware<PROPS>;
    private entities;
    store: Store;
    constructor(store: Store, name: string, props?: PROPS, schema?: SCHEMA);
    componentShouldUpdate(props: PROPS, nextProps: PROPS): boolean;
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
export declare abstract class StoreAwareComponent<PROPS, SCHEMA = {}> extends ComponentWrapper<SCHEMA> {
    store: Store;
    storeAware: StoreAware<PROPS>;
    private entities;
    constructor(store: Store, name: string, props?: PROPS, schema?: SCHEMA);
    abstract componentWillReceiveProps(props: PROPS, nextProps: PROPS): void;
    init(): void;
    getComponent(): this;
}
