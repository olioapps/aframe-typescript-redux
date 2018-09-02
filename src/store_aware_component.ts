import { Store } from "redux"
import { ComponentWrapper } from "aframe-typescript-toolkit"
import StoreAware from "./store_aware"
import { BaseRepository, RepositoryMember } from "./core"
import { RepositoryConnector } from "./connectors"

/**
 * Maintains a 1:1 relationship between a store object we want to watch, and
 * an aframe entity component instance
 */
export abstract class StoreAwareRepositoryComponent<
    PROPS, 
    STORE_OBJECT extends RepositoryMember, 
    STORE_REPOSITORY extends BaseRepository<STORE_OBJECT>, 
    SCHEMA = {},
> extends ComponentWrapper<SCHEMA> {
    
    storeAware: StoreAware<PROPS>
    private entities: Map<string, this> = new Map<string, this>()
    store: Store

    constructor(store: Store, name: string, props?: PROPS, schema?: SCHEMA) {
        super(name, schema)

        const that = this
        this.storeAware = new (class Connector extends RepositoryConnector<
            PROPS, STORE_OBJECT, STORE_REPOSITORY> {

            constructor(store: Store, props: PROPS) {
        super(store, props)
    }
    
            getRepository(props: PROPS): STORE_REPOSITORY {
                return that.resolveRepository(props)
    }

            destroyEntity(entity: STORE_OBJECT): void {
                that.destroyEntity(entity)
    }

            createEntity(entity: STORE_OBJECT): void {
                that.createEntity(entity)
    }

            updateEntity(entity: STORE_OBJECT): void {
                that.updateEntity(entity)
    }
        })(store, props)

        this.store = store
    }

    componentShouldUpdate(props: PROPS, nextProps: PROPS): boolean {
        // override
        return true
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
        return this.entities.get(id)
    }

    private updateEntityComponents(id: string, w: this) {
        this.entities.set(id, w)
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

export abstract class StoreAwareComponent<
    PROPS, 
    SCHEMA = {},
> extends ComponentWrapper<SCHEMA> {

    store: Store
    storeAware: StoreAware<PROPS>
    private entities: Map<string, this> = new Map<string, this>()

    constructor(store: Store, name: string, props?: PROPS, schema?: SCHEMA) {
        super(name, schema)

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

    init() {
        console.log(this)
        this.entities.set("entity", this)
    }

    getComponent(): this {
        return this.entities.get("entity")
    }
}