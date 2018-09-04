import { Store } from "redux"
import { ComponentWrapper, SystemWrapper } from "aframe-typescript-toolkit"
import StoreAware from "./store_aware"
import { BaseRepository, RepositoryMember } from "./core"

export abstract class StoreAwareComponent<
    PROPS, 
    SCHEMA = {},
> extends ComponentWrapper<SCHEMA> {

    store: Store
    storeAware: StoreAware<PROPS>
    protected sharedState: Map<string, this> = new Map<string, this>()

    constructor(store: Store, name: string, props?: PROPS, schema?: {}) {
        super(name, schema || {})

        const that = this
        this.storeAware = new (class Connector extends StoreAware<PROPS> {

            constructor(store: Store, props: PROPS) {
                super(store, props)
            }

            componentWillReceiveProps(props: PROPS, nextProps: PROPS): void {
                that.componentWillReceiveProps(props, nextProps)
            }
            
        })(store, props)

        this.store = store
    }

    abstract componentWillReceiveProps(props: PROPS, nextProps: PROPS): void

    keyOnComponentInit(component: this): string {
        return "_"
    }

    init() {
        const key = this.keyOnComponentInit(this)
        this.sharedState.set(key, this)
    }

    keyOnComponenGet(): string {
        return "_"
    }

    getComponent(): this {
        const key = this.keyOnComponenGet()
        return this.sharedState.get(key)
    }
}

/**
 * Watches the whole store
 */
export abstract class StoreAwareSystem<
    PROPS, 
    SHARED_STATE = {},
    SCHEMA = {},
> extends SystemWrapper<SCHEMA> {
    
    storeAware: StoreAware<PROPS>
    store: Store
    sharedState: Map<string, SHARED_STATE> = new Map<string, SHARED_STATE>()

    constructor(store: Store, name: string, props?: PROPS, schema?: {}) {
        super(name, schema || {})
        this.store = store

        const that = this
        this.storeAware = new (class Connector extends StoreAware<PROPS> {

            constructor(store: Store, props: PROPS) {
                super(store, props)
            }

            componentWillReceiveProps(props: PROPS, nextProps: PROPS): void {
                that.componentWillReceiveProps(props, nextProps)
            }
        })(store, props)

        this.store = store
    }

    abstract componentWillReceiveProps(props: PROPS, nextProps: PROPS): void

    getSharedState(): SHARED_STATE {
        const state: SHARED_STATE = <SHARED_STATE> this.sharedState.get("_")
        if (!state) {
           this.setSharedState(null)
        } else {
            return state
        }
    }

    setSharedState(sharedState: SHARED_STATE): void {
        this.sharedState.set("_", sharedState)
    }
}

/**
 * Maintains a 1:1 relationship between a store object we want to watch, and
 * an aframe entity component instance
 */
export abstract class StoreAwareRepositoryComponent<
    PROPS, 
    STORE_OBJECT extends RepositoryMember, 
    STORE_REPOSITORY extends BaseRepository<STORE_OBJECT>, 
    SCHEMA = {},
> extends StoreAwareComponent<PROPS, SCHEMA> {

    constructor(store: Store, name: string, props?: PROPS, schema?: {}) {
        super(store, name, props, schema)
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

    determineEntitiesToCreate(props: PROPS, nextProps: PROPS): STORE_OBJECT[] {
        const oldR = this.resolveRepository(props)
        const newR = this.resolveRepository(nextProps)
        return newR.sort.filter(b => oldR.sort.indexOf(b) < 0).map( i => newR.items[i])
    }

    determineEntitiesToDestroy(props: PROPS, nextProps: PROPS): STORE_OBJECT[] {
        const oldR = this.resolveRepository(props)
        const newR = this.resolveRepository(nextProps)
        return oldR.sort.filter(b => newR.sort.indexOf(b) < 0).map( i => oldR.items[i])
    }

    determineEntitiesToUpdate(props: PROPS, nextProps: PROPS): STORE_OBJECT[] {
        const oldR = this.resolveRepository(props)
        const newR = this.resolveRepository(nextProps)
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

    abstract resolveRepository(props: PROPS): STORE_REPOSITORY
    abstract resolveStoreObject(data: SCHEMA): STORE_OBJECT

    //
    // -- store object / aframe component lifecycle functions
    //
    abstract onStoreObjectCreate(bullet: STORE_OBJECT): AFrame.ANode
    onStoreObjectUpdate(entity: STORE_OBJECT, component: this): void {
        // override noop
    }

    // called right before the aframe component is destroyed
    beforeStoreObjectDestroy(entity: STORE_OBJECT, w: this): void {
        // override noop
    }

    private updateEntity(entity: STORE_OBJECT): void {
        const c = this.getEntityComponentsFor(entity.id)
        this.onStoreObjectUpdate(entity, c)
    }

    private createEntity(entity: STORE_OBJECT, parent?: AFrame.ANode): void {
        const aframeComponent = this.onStoreObjectCreate(entity)
        if (aframeComponent && parent) {
            // attach to optional parent
            parent.appendChild(aframeComponent)
        } else {
            // otherwise attach to scene
            document.querySelector("a-scene").appendChild(aframeComponent)
        }
    }

    private destroyEntity(entity: STORE_OBJECT): void {
        const aframeComponent = this.getEntityComponentsFor(entity.id)
        if (aframeComponent) {
            this.beforeStoreObjectDestroy(entity, aframeComponent)
            aframeComponent.destroy()
        }
    }

    private getEntityComponentsFor(id: string): this {
        return this.sharedState.get(id)
    }

    private updateEntityComponents(id: string, w: this) {
        this.sharedState.set(id, w)
    }

    //
    // -- aframe component lifecycle functions
    //

    /**
     * by default, register aframe component instance
     */
    init() {
        const storeObject: STORE_OBJECT = this.resolveStoreObject(this.data)
        this.updateEntityComponents(storeObject.id, this)
    }

}