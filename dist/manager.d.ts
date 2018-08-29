import { Store } from "redux";
import StoreAware from "./store_aware";
import { BaseRepository, RepositoryMember } from "./core";
import { ComponentWrapper } from "aframe-typescript-toolkit";
export default abstract class Manager<P, E extends RepositoryMember, R extends BaseRepository<E>, W extends ComponentWrapper, S> extends StoreAware<S, P> {
    private entities;
    constructor(store: Store, props: P);
    abstract getRepository(props: P): R;
    componentWillReceiveProps(props: P, nextProps: P): void;
    getEntityComponents(id: string): W[];
    updateEntityComponents(id: string, w: W[]): void;
    destroyEntity(id: string): void;
    createEntity(entity: E): void;
    updateEntity(entity: E): void;
}
