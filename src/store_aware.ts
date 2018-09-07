import { Store } from "redux"

export default class StoreAware<PROPS = {}> {
    protected localProps: PROPS
    protected store: Store

    constructor(store: Store, props?: PROPS) {
        if (!props || Object.keys(props).length < 1) {
            this.localProps = Object.assign({}, {...store.getState()})
        } else {
            this.localProps = Object.assign({}, props)
        }
        this.store = store

        store.subscribe( () => {
            const latestStoreState = store.getState()
            const keys = Object.keys(this.localProps)

            const nextProps = keys.reduce( 
                (acc, k): any => ({ ...acc, [k]: latestStoreState[k] }), 
                {},
            )
            const changed = keys.reduce( 
                (acc, k) => acc || nextProps[k] !== this.localProps[k], false)

            if (changed) {
                if (this.componentShouldUpdate(this.localProps, nextProps)) {
                    this.componentWillReceiveProps(this.localProps, nextProps)
                    this.localProps = {...nextProps}
                }
            }
        })
    }

    componentShouldUpdate(props: PROPS, nextProps: PROPS): boolean {
        // override
        return props !== nextProps
    }

    componentWillReceiveProps(props: PROPS, nextProps: PROPS): void {
        // override
    }
}