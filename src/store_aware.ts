import { Store } from "redux"

export default class StoreAware<S, P> {
    protected localProps: P
    protected store: Store

    constructor(store: Store, props?: P) {
        this.localProps = Object.assign({}, props)
        this.store = store

        store.subscribe( () => {
            const latestStoreState: S = store.getState()
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

                    this.render()
                }
            }
        })
    }

    componentShouldUpdate(props: P, nextProps: P): boolean {
        // override
        return true
    }

    componentWillReceiveProps(props: P, nextProps: P): void {
        // override
    }

    render() {
        // override
    }
}