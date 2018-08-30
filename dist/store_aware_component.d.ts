import { Store } from "redux";
import { ComponentWrapper } from "aframe-typescript-toolkit";
import StoreAware from "./store_aware";
import { BaseRepository, RepositoryMember } from "./core";
export default abstract class StoreAwareComponent<P, E extends RepositoryMember, R extends BaseRepository<E>, S = {}> extends ComponentWrapper<S> {
    storeAware: StoreAware<S, P>;
    entities: Map<string, this[]>;
    store: Store;
    constructor(store: Store, name: string, props?: P, schema?: S);
    componentShouldUpdate(props: P, nextProps: P): boolean;
    abstract getRepository(props: P): R;
    createEntity(entity: E): void;
    updateEntity(entity: E): void;
    destroyEntity(id: string): void;
    getEntityComponents(id: string): this[];
    updateEntityComponents(id: string, w: this[]): void;
}
