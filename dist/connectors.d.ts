import { Store } from "redux";
import StoreAware from "./store_aware";
import { BaseRepository, RepositoryMember } from "./core";
declare abstract class GenericPluralConnector<PROPS, STORE_OBJECT> extends StoreAware<PROPS> {
    constructor(store: Store, props: PROPS);
    componentWillReceiveProps(props: PROPS, nextProps: PROPS): void;
    abstract determineEntitiesToCreate(props: PROPS, nextProps: PROPS): STORE_OBJECT[];
    abstract determineEntitiesToDestroy(props: PROPS, nextProps: PROPS): STORE_OBJECT[];
    abstract determineEntitiesToUpdate(props: PROPS, nextProps: PROPS): STORE_OBJECT[];
    abstract destroyEntity(entity: STORE_OBJECT): void;
    abstract createEntity(entity: STORE_OBJECT): void;
    abstract updateEntity(entity: STORE_OBJECT): void;
}
export declare abstract class RepositoryConnector<PROPS, STORE_OBJECT extends RepositoryMember, STORE_REPOSITORY extends BaseRepository<STORE_OBJECT>> extends GenericPluralConnector<PROPS, STORE_OBJECT> {
    constructor(store: Store, props: PROPS);
    abstract getRepository(props: PROPS): STORE_REPOSITORY;
    determineEntitiesToCreate(props: PROPS, nextProps: PROPS): STORE_OBJECT[];
    determineEntitiesToDestroy(props: PROPS, nextProps: PROPS): STORE_OBJECT[];
    determineEntitiesToUpdate(props: PROPS, nextProps: PROPS): STORE_OBJECT[];
}
export {};
