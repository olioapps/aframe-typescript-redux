import { Store } from "redux"
import StoreAware from "./store_aware"
import { BaseRepository, RepositoryMember } from "./core"
import { ComponentWrapper } from "aframe-typescript-toolkit"

export default abstract class Manager<
        P, 
        E extends RepositoryMember, 
        R extends BaseRepository<E>,
        W extends ComponentWrapper,
        S
    > extends StoreAware<S, P> {
   
    private entities: Map<string, W[]> = new Map<string, W[]>()

    constructor(store: Store, props: P) {
        super(store, props)
    }

    abstract getRepository(props: P): R

    componentWillReceiveProps(props: P, nextProps: P): void {
        const oldR = this.getRepository(props)
        const newR = this.getRepository(nextProps)
        if (oldR !== newR) {
            // create entities that should exist
            const toCreate = newR.sort.filter(b => oldR.sort.indexOf(b) < 0)
            toCreate.forEach( b => this.createEntity(newR.items[b]))

            // destroy entities that shouldn't exist 
            const toDestroy = oldR.sort.filter(b => newR.sort.indexOf(b) < 0)
            toDestroy.forEach( b => this.destroyEntity(b))

            // update entities if needed
            const toUpdate = newR
                .sort.filter(b => toDestroy.indexOf(b) < 0 && newR.items[b] !== oldR.items[b])
            toUpdate.forEach(b => this.updateEntity(newR.items[b]))
        }
    }

    getEntityComponents(id: string): W[] {
        return this.entities.get(id)
    }

    updateEntityComponents(id: string, w: W[]) {
        this.entities.set(id, w)
    }
    
    destroyEntity(id: string): void {
        const components = this.entities.get(id) || []
        components.forEach( c => {
            c.destroy()
        })
    }

    createEntity(entity: E): void {
        // override
    }

    updateEntity(entity: E): void {
        // override
    }
}