import { Store } from "redux"
import StoreAware from "./store_aware"
import { BaseRepository, RepositoryMember } from "./core"

abstract class GenericPluralConnector<
        PROPS, 
        STORE_OBJECT, 
    > extends StoreAware<PROPS> {
   
    constructor(store: Store, props: PROPS) {
        super(store, props)
    }
    
    componentWillReceiveProps(props: PROPS, nextProps: PROPS): void {
        // create entities that should exist
        const toCreate = this.determineEntitiesToCreate(props, nextProps)
        toCreate.forEach(STORE_OBJECT => this.createEntity(STORE_OBJECT))

        // destroy entities that shouldn't exist 
        const toDestroy = this.determineEntitiesToDestroy(props, nextProps)
        toDestroy.forEach(STORE_OBJECT => this.destroyEntity(STORE_OBJECT))

        // update entities if needed
        const toUpdate = this.determineEntitiesToUpdate(props, nextProps)
        toUpdate.forEach(STORE_OBJECT => this.updateEntity(STORE_OBJECT))
    }

    abstract determineEntitiesToCreate(props: PROPS, nextProps: PROPS): STORE_OBJECT[]
    abstract determineEntitiesToDestroy(props: PROPS, nextProps: PROPS): STORE_OBJECT[]
    abstract determineEntitiesToUpdate(props: PROPS, nextProps: PROPS): STORE_OBJECT[]

    abstract destroyEntity(entity: STORE_OBJECT): void
    abstract createEntity(entity: STORE_OBJECT): void 
    abstract updateEntity(entity: STORE_OBJECT): void
}

export abstract class RepositoryConnector<
        PROPS, 
        STORE_OBJECT extends RepositoryMember, 
        STORE_REPOSITORY extends BaseRepository<STORE_OBJECT>,
    > extends GenericPluralConnector<PROPS, STORE_OBJECT> {
   
    constructor(store: Store, props: PROPS) {
        super(store, props)
    }

    abstract getRepository(props: PROPS): STORE_REPOSITORY

    determineEntitiesToCreate(props: PROPS, nextProps: PROPS): STORE_OBJECT[] {
        const oldR = this.getRepository(props)
        const newR = this.getRepository(nextProps)
        return newR.sort.filter(b => oldR.sort.indexOf(b) < 0).map( i => newR.items[i])
    }

    determineEntitiesToDestroy(props: PROPS, nextProps: PROPS): STORE_OBJECT[] {
        const oldR = this.getRepository(props)
        const newR = this.getRepository(nextProps)
        return oldR.sort.filter(b => newR.sort.indexOf(b) < 0).map( i => oldR.items[i])
    }

    determineEntitiesToUpdate(props: PROPS, nextProps: PROPS): STORE_OBJECT[] {
        const oldR = this.getRepository(props)
        const newR = this.getRepository(nextProps)
        const toDestroyIds = this.determineEntitiesToDestroy(props, nextProps).map( STORE_OBJECT => STORE_OBJECT.id )

        const toUpdate = newR
                .sort.filter(b => 
                    toDestroyIds.indexOf(b) < 0 
                    && oldR.sort.indexOf(b) > -1
                    && newR.sort.indexOf(b) > -1
                    && newR.items[b] !== oldR.items[b]
                )
        return toUpdate.map( i => newR.items[i])
    }
}