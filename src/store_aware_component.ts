import { Store } from "redux"
import { ComponentWrapper } from "aframe-typescript-toolkit"
import StoreAware from "./store_aware"
import { BaseRepository, RepositoryMember } from "./core"
import Manager from "./manager"

class Connector<
    P, 
    E extends RepositoryMember, 
    R extends BaseRepository<E>, 
    S,
    W extends StoreAwareComponent<P, E, R, S>
> extends Manager<P, E, R, W, S> {
    component: W
    constructor(store: Store, props: P, component: W) {
        super(store, props)
        this.component = component
    }
    
    getRepository(props: P): R {
        return this.component.getRepository(props)
    }

    destroyEntity(id: string): void {
        this.component.destroyEntity(id)
    }

    createEntity(entity: E): void {
        this.component.createEntity(entity)
    }

    updateEntity(entity: E): void {
        this.component.updateEntity(entity)
    }
}

export default abstract class StoreAwareComponent<
    P, 
    E extends RepositoryMember, R extends BaseRepository<E>, 
    S = {},
> extends ComponentWrapper<S> {
    
    storeAware: StoreAware<S, P>
    entities: Map<string, this[]> = new Map<string, this[]>()
    store: Store

    constructor(store: Store, name: string, props?: P, schema?: S) {
        super(name, schema)

        this.storeAware = new Connector<P, E, R, S, this>(store, props, this)
        this.store = store
        this.register()
    }

    componentShouldUpdate(props: P, nextProps: P): boolean {
        // override
        return true
    }

    abstract getRepository(props: P): R

    createEntity(entity: E): void {
        // override
    }

    updateEntity(entity: E): void {
        // override
    }

    destroyEntity(id: string): void {
        const components = this.entities.get(id) || []
        components.forEach( c => {
            c.destroy()
        })
    }

    getEntityComponents(id: string): this[] {
        return this.entities.get(id)
    }

    updateEntityComponents(id: string, w: this[]) {
        this.entities.set(id, w)
    }
    
}