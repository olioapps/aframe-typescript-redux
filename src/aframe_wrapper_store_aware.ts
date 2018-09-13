import { Store } from "redux"
import { ComponentWrapper, SystemWrapper } from "aframe-typescript-toolkit"
import StoreAware from "./store_aware"
import { BaseRepository, RepositoryMember, BaseMap } from "./core"

interface CanReceiveProps<PROPS> {
    componentWillReceiveProps: (props: PROPS, nextProps: PROPS) => void
}

class Connector<PROPS> extends StoreAware<PROPS> {
    private receiver: CanReceiveProps<PROPS>
    constructor(store: Store, props: PROPS, receiver: CanReceiveProps<PROPS>) {
        super(store, props)
        this.receiver = receiver
    }

    componentWillReceiveProps(props: PROPS, nextProps: PROPS): void {
        this.receiver.componentWillReceiveProps(props, nextProps)
    }
}

class SharedStateContainer<SHARED_STATE> {
    private sharedState: Map<string, SHARED_STATE> = new Map<string, SHARED_STATE>()

    get(): SHARED_STATE {
        const state: SHARED_STATE = <SHARED_STATE> this.sharedState.get("_")
        if (!state) {
           this.set(null)
        } else {
            return state
        }
    }

    set(sharedState: SHARED_STATE): void {
        this.sharedState.set("_", sharedState)
    }
}

export abstract class StoreAwareComponent<
    PROPS, 
    SHARED_STATE = {},
    SCHEMA = {},
> extends ComponentWrapper<SCHEMA> {

    storeAware: StoreAware<PROPS>
    store: Store
    private sharedState = new SharedStateContainer<SHARED_STATE>()

    constructor(store: Store, name: string, props?: PROPS, schema?: {}) {
        super(name, schema || {})
        this.storeAware = new Connector<PROPS>(store, props, this)
        this.store = store
    }

    abstract componentWillReceiveProps(props: PROPS, nextProps: PROPS): void

    getSharedState(): SHARED_STATE {
        return this.sharedState.get()
    }

    setSharedState(sharedState: SHARED_STATE): void {
        return this.sharedState.set(sharedState)
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
    private sharedState = new SharedStateContainer<SHARED_STATE>()

    constructor(store: Store, name: string, props?: PROPS, schema?: {}) {
        super(name, schema || {})
        this.store = store
        this.storeAware = new Connector<PROPS>(store, props, this)
        this.store = store
    }

    abstract componentWillReceiveProps(props: PROPS, nextProps: PROPS): void

    getSharedState(): SHARED_STATE {
        return this.sharedState.get()
    }

    setSharedState(sharedState: SHARED_STATE): void {
        return this.sharedState.set(sharedState)
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Maintains a 1:1 relationship between a store object we want to watch, and
 * an aframe entity component instance
 */
export abstract class StoreAwareRepositoryComponent<
    PROPS, 
    STORE_OBJECT extends RepositoryMember, 
    STORE_REPOSITORY extends BaseRepository<STORE_OBJECT>, 
    SCHEMA = {},
> extends StoreAwareComponent<PROPS, Map<string, any>, SCHEMA> {

    constructor(store: Store, name: string, props?: PROPS, schema?: {}) {
        super(store, name, props, schema)
        this.setSharedState(new Map<string, any>())
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
        return this.getSharedState().get(id)
    }

    private updateEntityComponents(id: string, w: this) {
        this.getSharedState().set(id, w)
    }

    //
    // -- aframe component lifecycle functions
    //

    /**
     * by default, register aframe component instance
     */
    init() {
        super.init()
        const storeObject: STORE_OBJECT = this.resolveStoreObject(this.data)
        this.updateEntityComponents(storeObject.id, this)
    }

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface ReduxConnectedComponentSchema {
    readonly propsToHandlerMapping: BaseMap<string>
}

export class ReduxConnectedComponent extends ComponentWrapper<ReduxConnectedComponentSchema, ReduxConnectedSystem> {

    constructor() {
        super("redux-connected")
    }

    init() {
        this.system.connect(this)
    }

}

interface ReduxConnectedProps {}

interface ReduxConnectorSharedState {
    propsToComponentMapping: BaseMap<ComponentFunction[]>
}

interface ComponentFunction {
    component: ReduxConnectedComponent
    callback: string
}

export class ReduxConnectedSystem extends StoreAwareSystem<{}, ReduxConnectorSharedState> {
    constructor(store: Store, props?: {}) {
        super(store, "redux-connected", props)

        this.setSharedState({
            propsToComponentMapping: {}
        })
        new ReduxConnectedComponent().register()
    }

    connect(component: ReduxConnectedComponent) {
        // add store dispatch
        component.el["dispatch"] = this.store.dispatch

        // handle cleaning up - remove references to destroyed entities
        const that = this
        component.el.addEventListener("componentremoved", (evt) => {
            const { propsToComponentMapping } = that.getSharedState()
            const updated: BaseMap<ComponentFunction[]> = Object.keys(propsToComponentMapping)
                .reduce( 
                    (acc, k) =>
                        ({
                            ...acc,
                            [k]: propsToComponentMapping[k].filter(f => f.component.el != component.el)
                        }),
                    {}
                )   

            that.setSharedState({
                propsToComponentMapping: updated,
            })
        })

        const propsToHandlerMapping = component.data
        const state = this.getSharedState()
        const propsToComponentMapping: BaseMap<ComponentFunction[]> = Object.keys(propsToHandlerMapping)
            .reduce( 
                (acc, propKey) => {
                    const propComponentFunctions = state.propsToComponentMapping[propKey] || []
                    const callback = propsToHandlerMapping[propKey] || propKey
                    
                    return {
                        ...acc,
                        [propKey]: [...propComponentFunctions, {
                            component,
                            callback,
                        }]
                    }}, 
                { ...state.propsToComponentMapping }
            )

        this.setSharedState({
            propsToComponentMapping, 
        })
    }

    componentWillReceiveProps(props: ReduxConnectedProps, nextProps: ReduxConnectedProps) {
        const state = this.getSharedState()
        const { propsToComponentMapping } = state
        Object.keys(propsToComponentMapping)
            .filter( k => props[k] !== nextProps[k])
            .forEach( k => {
                // notify listeners for that change
                propsToComponentMapping[k].forEach( listener => {
                    listener.component.el.emit(listener.callback, {
                        oldState: props[k],
                        newState: nextProps[k],
                    })
                })
            })
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function dispatch(component: ComponentWrapper, action: {}): void {
    if (!component.el) {
        return
    }

    const dispatcher = component.el["dispatch"]
    if (dispatcher) {
        dispatcher(action)
    }
}